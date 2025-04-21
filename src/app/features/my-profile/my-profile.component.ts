import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../home/header/header.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  Auth,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  User,
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  deleteAccountForm: FormGroup;
  currentUser: User | null = null;
  profileImageUrl: string | null = null;
  isLoading = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private firestore: Firestore
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.pattern('^[0-9]{10}$')],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.deleteAccountForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Add a console log to check if ngOnInit is being called
    console.log('MyProfileComponent initialized');

    onAuthStateChanged(this.auth, (user) => {
      console.log('User state changed:', user);
      if (user) {
        this.currentUser = user;
        console.log('myprofile-container', this.currentUser);
        this.loadUserData();
        this.loadProfileImage();
      } else {
        console.log('No user logged in');
        this.router.navigate(['/auth']);
      }
    });
  }

  // Add the missing showMessage method
  showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }

  async loadUserData(): Promise<void> {
    console.log('Loading user data for:', this.currentUser?.email);
    if (this.currentUser) {
      // Set the basic user data from Firebase Auth
      this.profileForm.patchValue({
        displayName: this.currentUser.displayName || '',
        email: this.currentUser.email || '',
      });

      let phoneNumber = null;

      // Try to get the phone number from Firestore first
      try {
        const userRef = doc(this.firestore, 'users', this.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data()?.['phoneNumber']) {
          phoneNumber = userDoc.data()['phoneNumber'];
          console.log('Phone number loaded from Firestore:', phoneNumber);
        }
      } catch (firestoreError) {
        console.error('Error loading from Firestore:', firestoreError);
        // Fall back to localStorage
      }

      // If not found in Firestore, try localStorage
      if (!phoneNumber && this.currentUser.uid) {
        phoneNumber = localStorage.getItem(
          `user_${this.currentUser.uid}_phone`
        );
        if (phoneNumber) {
          console.log('Phone number loaded from localStorage:', phoneNumber);

          // Optionally sync back to Firestore if found in localStorage but not in Firestore
          try {
            const userRef = doc(this.firestore, 'users', this.currentUser.uid);
            await setDoc(userRef, { phoneNumber }, { merge: true });
            console.log('Synced phone number from localStorage to Firestore');
          } catch (syncError) {
            console.error('Error syncing to Firestore:', syncError);
          }
        }
      }

      // Update the form if we found a phone number
      if (phoneNumber) {
        this.profileForm.patchValue({ phoneNumber });
      }
    }
  }

  loadProfileImage(): void {
    if (this.currentUser && this.currentUser.photoURL) {
      this.profileImageUrl = this.currentUser.photoURL;
      console.log('Profile image URL:', this.profileImageUrl);
    } else {
      this.profileImageUrl =
        'https://th.bing.com/th/id/OIP.a9qb_VLfFjvlrDfc-iNLpgHaHa?rs=1&pid=ImgDetMain';
      console.log('Using default profile image');
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log('File selected:', this.selectedFile.name);
      this.uploadProfileImage();
    }
  }

  async uploadProfileImage(): Promise<void> {
    if (!this.selectedFile || !this.currentUser) return;

    this.isLoading = true;
    try {
      const storage = getStorage();
      console.log('Uploading profile image...');

      // Delete existing profile image if it exists
      if (
        this.currentUser.photoURL &&
        this.currentUser.photoURL.includes('firebase')
      ) {
        const oldImageRef = ref(
          storage,
          `profile-images/${this.currentUser.uid}`
        );
        await deleteObject(oldImageRef).catch((error) => {
          console.log('No existing image to delete or error:', error);
        });
      }

      // Upload new image
      const storageRef = ref(storage, `profile-images/${this.currentUser.uid}`);
      await uploadBytes(storageRef, this.selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile(this.currentUser, { photoURL: downloadURL });
      this.profileImageUrl = downloadURL;
      console.log('Profile image updated successfully:', downloadURL);
      this.showMessage('Profile image updated successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      this.showMessage(`Error uploading image: ${error.message}`, true);
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.showMessage('Please fill in all required fields correctly', true);
      return;
    }

    this.isLoading = true;
    try {
      if (!this.currentUser) throw new Error('User not authenticated');

      const { displayName, email, phoneNumber } = this.profileForm.value;
      console.log('Updating profile with:', {
        displayName,
        email,
        phoneNumber,
      });

      // Update display name
      await updateProfile(this.currentUser, { displayName });

      // Update email if changed
      if (email !== this.currentUser.email) {
        await updateEmail(this.currentUser, email);
      }

      // Store phone number in localStorage
      if (this.currentUser.uid) {
        localStorage.setItem(
          `user_${this.currentUser.uid}_phone`,
          phoneNumber || ''
        );
        console.log('Phone number saved to localStorage:', phoneNumber);
      }

      // Try to store in Firestore
      try {
        const userRef = doc(this.firestore, 'users', this.currentUser.uid);
        await setDoc(
          userRef,
          {
            phoneNumber: phoneNumber || '',
            // You can add other user data here
            displayName: displayName,
            email: email,
            lastUpdated: new Date(),
          },
          { merge: true }
        );
        console.log('User data saved to Firestore');
      } catch (firestoreError) {
        console.error(
          'Error saving to Firestore, using localStorage only:',
          firestoreError
        );
        // We already saved to localStorage, so we can continue
      }

      console.log('Profile updated successfully');
      this.showMessage('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      this.showMessage(`Error updating profile: ${error.message}`, true);
    } finally {
      this.isLoading = false;
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.showMessage('Please fill in all password fields correctly', true);
      return;
    }

    if (
      this.passwordForm.value.newPassword !==
      this.passwordForm.value.confirmPassword
    ) {
      this.showMessage('New passwords do not match', true);
      return;
    }

    this.isLoading = true;
    try {
      if (!this.currentUser || !this.currentUser.email)
        throw new Error('User not authenticated');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        this.currentUser.email,
        this.passwordForm.value.currentPassword
      );
      await reauthenticateWithCredential(this.currentUser, credential);

      // Change password
      await updatePassword(
        this.currentUser,
        this.passwordForm.value.newPassword
      );

      this.passwordForm.reset();
      this.showMessage('Password changed successfully');
    } catch (error: any) {
      console.error('Error changing password:', error);
      this.showMessage(`Error changing password: ${error.message}`, true);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteAccount(): Promise<void> {
    if (this.deleteAccountForm.invalid) {
      this.showMessage(
        'Please enter your password to confirm account deletion',
        true
      );
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    this.isLoading = true;
    try {
      if (!this.currentUser || !this.currentUser.email)
        throw new Error('User not authenticated');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        this.currentUser.email,
        this.deleteAccountForm.value.password
      );
      await reauthenticateWithCredential(this.currentUser, credential);

      // Delete profile image if exists
      if (
        this.currentUser.photoURL &&
        this.currentUser.photoURL.includes('firebase')
      ) {
        const storage = getStorage();
        const imageRef = ref(storage, `profile-images/${this.currentUser.uid}`);
        await deleteObject(imageRef).catch(() => {
          // Ignore if file doesn't exist
        });
      }

      // Delete user account
      await deleteUser(this.currentUser);

      this.showMessage('Your account has been deleted');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      this.showMessage(`Error deleting account: ${error.message}`, true);
    } finally {
      this.isLoading = false;
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/home']);
    });
  }
}
