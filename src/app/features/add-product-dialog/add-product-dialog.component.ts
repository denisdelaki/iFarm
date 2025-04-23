import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Database, ref, set, push } from '@angular/fire/database';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

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

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
  ],
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css'],
})
export class AddProductDialogComponent {
  newProduct: Product;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isLoading = false;
  categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Meat',
    'Poultry',
    'Seeds',
    'Equipment',
    'Other',
  ];

  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private snackBar: MatSnackBar,
    private database: Database
  ) {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      imageUrls: [],
      location: '',
      sellerId: '',
      sellerName: '',
      sellerEmail: '',
      sellerPhone: '',
      createdAt: null,
      inventory: {
        total: 1,
        remaining: 1,
      },
      category: '',
    };
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeSelectedImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  async uploadImages(): Promise<string[]> {
    if (this.selectedFiles.length === 0) {
      this.snackBar.open('Please select at least one image.', 'Close', {
        duration: 3000,
      });
      return [];
    }

    try {
      const uploadedUrls: string[] = [];
      for (const file of this.selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'marketImages');
        formData.append('api_key', '577692892646954');
        formData.append(
          'folder',
          `ifarm/marketImages/${this.data.user?.uid || 'anonymous'}`
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      if (uploadedUrls.length > 0) {
        return uploadedUrls;
      } else {
        throw new Error('Image upload failed.');
      }
    } catch (err: any) {
      throw err;
    }
  }

  validateProductForm(): boolean {
    if (!this.newProduct.name.trim()) {
      this.snackBar.open('Please enter a product name', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (!this.newProduct.description.trim()) {
      this.snackBar.open('Please enter a product description', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (this.newProduct.price <= 0) {
      this.snackBar.open('Please enter a valid price', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (!this.newProduct.location.trim()) {
      this.snackBar.open('Please enter a location', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (!this.newProduct.category) {
      this.snackBar.open('Please select a category', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (this.selectedFiles.length === 0) {
      this.snackBar.open('Please upload at least one image', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (this.newProduct.inventory.total <= 0) {
      this.snackBar.open('Please enter a valid inventory amount', 'Close', {
        duration: 3000,
      });
      return false;
    }
    return true;
  }

  async addProduct() {
    if (!this.data.user) {
      this.snackBar.open('Please log in to add a product.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (!this.validateProductForm()) {
      return;
    }

    this.isLoading = true;

    try {
      const uploadedImageUrls = await this.uploadImages();
      if (uploadedImageUrls.length === 0) {
        this.isLoading = false;
        return;
      }

      this.newProduct.imageUrls = uploadedImageUrls;
      this.newProduct.sellerId = this.data.user.uid;
      this.newProduct.sellerName = this.data.user.displayName || 'Anonymous';
      this.newProduct.sellerEmail = this.data.user.email;
      this.newProduct.sellerPhone =
        this.data.user.phoneNumber || 'Not provided';
      this.newProduct.createdAt = new Date().toISOString();

      const productsRef = ref(this.database, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, this.newProduct);

      this.snackBar.open('Product added successfully!', 'Close', {
        duration: 3000,
      });

      // Close the dialog and pass success result
      this.dialogRef.close({ success: true });
    } catch (err: any) {
      this.snackBar.open('Error adding product: ' + err.message, 'Close', {
        duration: 3000,
      });
      this.dialogRef.close({ success: false, error: err.message });
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
