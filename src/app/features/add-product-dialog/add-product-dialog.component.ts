import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Database, ref, push, set, update } from '@angular/fire/database';
import {
  Storage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatSpinner,
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css'],
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Meat',
    'Poultry',
    'Fish',
    'Seeds',
    'Fertilizers',
    'Equipment',
    'Other',
  ];
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private database: Database,
    private storage: Storage,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditing = data?.isEditing || false;

    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      location: ['', [Validators.required]],
      inventory: this.fb.group({
        total: [1, [Validators.required, Validators.min(1)]],
        remaining: [1, [Validators.required, Validators.min(0)]],
      }),
    });
  }

  ngOnInit(): void {
    if (this.isEditing && this.data.product) {
      // If editing, populate the form with existing product data
      const product = this.data.product;
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        location: product.location,
        inventory: {
          total: product.inventory.total,
          remaining: product.inventory.remaining,
        },
      });

      // Set preview URLs for existing images
      if (product.imageUrls && product.imageUrls.length > 0) {
        this.previewUrls = [...product.imageUrls];
      }
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImage(index: number): void {
    // If editing and removing an existing image
    if (
      this.isEditing &&
      index < this.previewUrls.length &&
      index >= this.selectedFiles.length
    ) {
      this.previewUrls.splice(index, 1);
    } else {
      // If removing a newly added image
      this.selectedFiles.splice(index, 1);
      this.previewUrls.splice(index, 1);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isLoading = true;
    try {
      const formData = this.productForm.value;

      // Upload images if there are any new ones selected
      let imageUrls: string[] = [];

      // If editing, start with existing images
      if (this.isEditing && this.data.product.imageUrls) {
        imageUrls = [...this.data.product.imageUrls];
      }

      // Upload any new images
      if (this.selectedFiles.length > 0) {
        for (const file of this.selectedFiles) {
          const filePath = `product-images/${Date.now()}_${file.name}`;
          const fileRef = storageRef(this.storage, filePath);
          await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(fileRef);
          imageUrls.push(downloadUrl);
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        location: formData.location,
        imageUrls: imageUrls,
        sellerId: this.data.user.uid,
        sellerName: this.data.user.displayName || 'Anonymous',
        sellerEmail: this.data.user.email,
        sellerPhone: this.data.user.phoneNumber || 'Not provided',
        inventory: formData.inventory,
        createdAt: this.isEditing
          ? this.data.product.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (this.isEditing) {
        // Update existing product
        const productRef = ref(
          this.database,
          `products/${this.data.product.id}`
        );
        await update(productRef, productData);
      } else {
        // Add new product
        const productsRef = ref(this.database, 'products');
        await push(productsRef, productData);
      }

      this.dialogRef.close({ success: true });
    } catch (error: any) {
      this.snackBar.open(`Error: ${error.message}`, 'Close', {
        duration: 5000,
      });
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
