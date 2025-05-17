import * as functions from "firebase-functions/v2/https";
import {config} from "firebase-functions";
import * as admin from "firebase-admin";
import axios, {AxiosError} from "axios";
import cors from "cors";
import {Request, Response} from "express";

// Initialize Firebase Admin
admin.initializeApp();

// M-Pesa Credentials (store securely in Firebase Environment Variables)
const MPESA_CONSUMER_KEY = config().mpesa.consumer_key;
const MPESA_CONSUMER_SECRET = config().mpesa.consumer_secret;
const MPESA_SHORTCODE = config().mpesa.shortcode;
const MPESA_PASSKEY = config().mpesa.passkey;
const MPESA_API_URL = "https://sandbox.safaricom.co.ke"; // Use sandbox for testing

// Enable CORS
const corsHandler = cors({origin: true});

/**
 * Retrieves an OAuth token from the M-Pesa API.
 * @return {Promise<string>} The access token.
 */
async function getMpesaToken(): Promise<string> {
  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString("base64");
  const response = await axios.get(
    `${MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {Authorization: `Basic ${auth}`},
    }
  );
  return response.data.access_token;
}

interface StkPushRequestBody {
  phoneNumber: string;
  amount: number;
  orderId: string;
}

/**
 * Cloud Function: Initiates an M-Pesa STK Push payment.
 * @param {Request} req - The HTTP request.
 * @param {Response} res - The HTTP response.
 */
export const stkPush = functions.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const {phoneNumber, amount, orderId}: StkPushRequestBody = req.body;

      if (!phoneNumber || !amount || !orderId) {
        res.status(400).json({error: "Missing required parameters"});
        return;
      }

      try {
        const token = await getMpesaToken();
        const timestamp = new Date()
          .toISOString()
          .replace(/[^0-9]/g, "")
          .slice(0, 14);
        const password = Buffer.from(
          `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
        ).toString("base64");

        const payload = {
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.ceil(amount), // M-Pesa requires integer amounts
          PartyA: phoneNumber,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `https://${process.env.GCLOUD_PROJECT}.cloudfunctions.net/mpesaCallback`,
          AccountReference: `Order-${orderId}`,
          TransactionDesc: `Payment for Order ${orderId}`,
        };

        const response = await axios.post(
          `${MPESA_API_URL}/mpesa/stkpush/v1/processrequest`,
          payload,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        res.status(200).json(response.data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(
          "STK Push Error:",
          (error as AxiosError).response?.data || errorMessage
        );
        res.status(500).json({error: "Failed to initiate STK Push"});
      }
    });
  }
);

interface MpesaCallbackRequestBody {
  Body: {
    stkCallback: {
      ResultCode: string;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value?: string }>;
      };
    };
  };
}

/**
 * Cloud Function: Handles M-Pesa transaction callback.
 * @param {Request} req - The HTTP request.
 * @param {Response} res - The HTTP response.
 */
export const mpesaCallback = functions.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const result: MpesaCallbackRequestBody["Body"]["stkCallback"] =
        req.body.Body.stkCallback;
      console.log("M-Pesa Callback:", result);

      try {
        const orderId = result.CallbackMetadata?.Item.find(
          (item) => item.Name === "AccountReference"
        )?.Value?.replace("Order-", "");

        if (result.ResultCode === "0" && orderId) {
          // Payment successful, update order status in Firebase
          const orderRef = admin.database().ref(`orders/${orderId}`);
          await orderRef.update({status: "paid"});
        } else {
          // Payment failed, log error
          console.error("Payment failed:", result.ResultDesc);
        }

        // Respond to M-Pesa to acknowledge receipt
        res.status(200).json({
          ResponseCode: "00000000",
          ResponseDesc: "Success",
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Callback Error:", errorMessage);
        res.status(500).json({error: "Failed to process callback"});
      }
    });
  }
);
