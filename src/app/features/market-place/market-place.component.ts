import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { Auth, authState } from '@angular/fire/auth';
import {
  Database,
  ref,
  onValue,
  update,
  push,
  set,
} from '@angular/fire/database';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { MatSelectModule } from '@angular/material/select';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  location: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  createdAt: any;
  inventory: {
    total: number;
    remaining: number;
  };
  category: string;
}

interface Order {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  totalPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: any;
}

@Component({
  selector: 'app-market-place',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.css'],
})
export class MarketPlaceComponent implements OnInit {
  products: Product[] = [];
  user: any;
  orders: Order[] = [];
  isLoading = false;
  activeTab = 0;
  // stripe: Stripe | null = null; // Stripe instance

  // Stats
  totalProducts = 0;
  myProducts = 0;
  myOrders = 0;

  // For image carousel
  currentImageIndex: { [key: string]: number } = {};

  constructor(
    private auth: Auth,
    private database: Database,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    // Initialize Stripe with your Publishable Key
    // this.stripe = await loadStripe(
    //   'pk_test_51MBL1aCD3E7fzycfXn5nDwha4WVcS4bSC2nX5k5CTwIKTw8ZPzXl8n7ngi0Kxqw47M1fB1HKo4A5J4LmTqdtlj2g00bYVSs3jO'
    // );

    authState(this.auth).subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          this.loadProducts();
          this.loadOrders(user.uid);
        } else {
          this.isLoading = false;
          this.snackBar.open(
            'Please log in to access the marketplace.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Authentication error: ' + err.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      data: { user: this.user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.activeTab = 0;
      }
    });
  }

  loadProducts() {
    const productsRef = ref(this.database, 'products');

    onValue(
      productsRef,
      (snapshot) => {
        this.products = [];
        snapshot.forEach((childSnapshot) => {
          const product = childSnapshot.val();
          product.id = childSnapshot.key;

          this.currentImageIndex[product.id] = 0;

          if (!Array.isArray(product.imageUrls)) {
            product.imageUrls = product.imageUrl ? [product.imageUrl] : [];
          }

          if (!product.inventory) {
            product.inventory = {
              total: 1,
              remaining: 1,
            };
          }

          this.products.push(product);
        });

        this.totalProducts = this.products.length;
        this.myProducts = this.products.filter(
          (p) => p.sellerId === this.user.uid
        ).length;

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open(
          'Error loading products: ' + error.message,
          'Close',
          {
            duration: 3000,
          }
        );
      }
    );
  }

  getCurrentImageIndex(product: Product): number {
    return product.id ? this.currentImageIndex[product.id] || 0 : 0;
  }

  setCurrentImageIndex(product: Product, index: number) {
    if (product.id) {
      this.currentImageIndex[product.id] = index;
    }
  }

  prevImage(product: Product) {
    if (product.id && product.imageUrls.length > 0) {
      const current = this.getCurrentImageIndex(product);
      this.setCurrentImageIndex(
        product,
        (current - 1 + product.imageUrls.length) % product.imageUrls.length
      );
    }
  }

  nextImage(product: Product) {
    if (product.id && product.imageUrls.length > 0) {
      const current = this.getCurrentImageIndex(product);
      this.setCurrentImageIndex(
        product,
        (current + 1) % product.imageUrls.length
      );
    }
  }

  async loadOrders(userId: string) {
    try {
      const ordersRef = ref(this.database, 'orders');

      onValue(ordersRef, (snapshot) => {
        this.orders = [];
        snapshot.forEach((childSnapshot) => {
          const order = childSnapshot.val();
          order.id = childSnapshot.key;

          if (order.buyerId === userId || order.sellerId === userId) {
            this.orders.push(order);
          }
        });

        this.myOrders = this.orders.filter((o) => o.buyerId === userId).length;
      });
    } catch (err: any) {
      this.snackBar.open('Error loading orders: ' + err.message, 'Close', {
        duration: 3000,
      });
    }
  }

  async buyProduct(product: Product) {
    if (!this.user) {
      this.snackBar.open('Please log in to make a purchase.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (product.inventory.remaining <= 0) {
      this.snackBar.open('This product is out of stock.', 'Close', {
        duration: 3000,
      });
      return;
    }

    try {
      // Create the order in Firebase
      const order: Order = {
        productId: product.id!,
        productName: product.name,
        productImage: product.imageUrls[0] || '',
        quantity: 1,
        totalPrice: product.price,
        buyerId: this.user.uid,
        buyerName: this.user.displayName || 'Anonymous',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const ordersRef = ref(this.database, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, order);

      // Update product inventory
      const productRef = ref(this.database, `products/${product.id}`);
      const newRemainingCount = product.inventory.remaining - 1;
      await update(productRef, {
        'inventory/remaining': newRemainingCount,
      });

      // Create Stripe checkout session
      const session = await this.createCheckoutSession(
        product,
        newOrderRef.key!
      );

      // Redirect to Stripe Checkout
      // if (this.stripe && session.id) {
      //   const { error } = await this.stripe.redirectToCheckout({
      //     sessionId: session.id,
      //   });
      //   if (error) {
      //     throw new Error(error.message);
      //   }
      // } else {
      //   throw new Error('Stripe is not initialized.');
      // }

      this.snackBar.open('Redirecting to checkout...', 'Close', {
        duration: 3000,
      });
    } catch (err: any) {
      this.snackBar.open('Error initiating purchase: ' + err.message, 'Close', {
        duration: 3000,
      });
    }
  }

  async createCheckoutSession(product: Product, orderId: string) {
    try {
      const response = await fetch(
        'http://localhost:3000/create-checkout-session',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: product.name,
            price: product.price * 100, // Convert to cents for Stripe
            currency: 'usd',
            success_url: `${window.location.origin}/marketplace`, // Adjust as needed
            cancel_url: `${window.location.origin}/marketplace`, // Adjust as needed
            metadata: { orderId },
          }),
        }
      );

      const data = await response.json();
      if (data.id) {
        return data;
      } else {
        throw new Error('Failed to create checkout session.');
      }
    } catch (err: any) {
      this.snackBar.open(
        'Error creating checkout session: ' + err.message,
        'Close',
        {
          duration: 3000,
        }
      );
      throw err;
    }
  }

  async updateOrderStatus(
    orderId: string | undefined,
    status: Order['status']
  ) {
    if (!orderId) {
      this.snackBar.open('Error: Order ID is missing', 'Close', {
        duration: 3000,
      });
      return;
    }

    try {
      const orderRef = ref(this.database, `orders/${orderId}`);
      await update(orderRef, { status });

      this.snackBar.open(`Order status updated to ${status}`, 'Close', {
        duration: 3000,
      });
    } catch (err: any) {
      this.snackBar.open(
        'Error updating order status: ' + err.message,
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}
