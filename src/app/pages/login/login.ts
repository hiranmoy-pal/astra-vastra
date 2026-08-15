import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Http } from '../../core/services/api/http';
import { Toast } from '../../core/services/toast/toast';
import { Loading } from '../../core/services/loading/loading';
import { interval, Subscription } from 'rxjs';
import { Alert } from '../../core/services/alert/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, Header, Footer, RouterModule, RouterLink, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login implements OnInit, OnDestroy {

  showLogin: boolean = true;
  showOtp: boolean = false;
  showRegister: boolean = false;

  loginForm!: FormGroup;
  email: string = '';
  emailError: string = '';

  otpForm!: FormGroup;
  otp: string = '';
  otpError: string = '';
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  resendTime = signal(300);
  canResendOtp = signal(false);
  resendTimerSubscription!: Subscription;

  registerForm!: FormGroup;
  registerErrors = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    gender: '',
    agree: ''
  };

  constructor(
    private fb: FormBuilder, private authService: Http, public toastService: Toast, public loadingService: Loading, private alertService: Alert, private router: Router
  ) {
    this.InitializeoginForm();
    this.initializeOtpForm();
    this.initializeRegisterForm();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.resendTimerSubscription) {
      this.resendTimerSubscription.unsubscribe();
    }
  }

  // ************login form submission ************* \\

  InitializeoginForm() {
    this.loginForm = this.fb.group({
      userInput: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onLoginSubmit(): void {
    this.email = this.loginForm.get('userInput')?.value?.trim();
    if (!this.email) {
      this.emailError = 'Email is required.';
      return;
    }
    if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }
    const payload = { email: this.email };
    this.sentOtp(payload);
  }

  sentOtp(payload: any) {
    this.loadingService.show();
    this.authService.sentOtp(payload).subscribe({
      next: (response: any) => {
        this.loadingService.hide();
        console.log('OTP API response:', response);
        if (response.status) {
          this.loginForm.reset();
          this.showLogin = false;
          this.showRegister = false;
          this.showOtp = true;
          this.startResendTimer();
          this.loginForm.reset();
          this.toastService.show('OTP sent successfully', 'success');
        } else {
          this.toastService.show('OTP sent failed. Please try again.', 'error');
        }
      },
      error: (error: any) => {
        this.loadingService.hide(); this.toastService.show('Something went wrong. Please try again.', 'error');
        console.error('OTP API error:', error);
      }
    });
  }

  // ************Otp submission ************* \\

  initializeOtpForm() {
    this.otpForm = this.fb.group({
      otp: ['']
    });
  }

  onBack() {
    this.showLogin = true;
    this.showOtp = false;
    this.showRegister = false;
    this.emailError = '';
    this.otpError = '';
    this.otp = '';
    this.otpForm.reset();
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    this.otpError = '';
    if (input.value && index < 5) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
    this.updateOtp();
  }


  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Backspace') {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.value) {
      input.value = '';
      this.updateOtp();
      return;
    }
    if (index > 0) {
      event.preventDefault();
      const previousInput = this.otpInputs.get(index - 1)?.nativeElement;
      previousInput?.focus();
      if (previousInput) {
        previousInput.value = '';
      }
      this.updateOtp();
    }
  }


  onOtpPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const digits = pastedText.replace(/\D/g, '');
    if (!digits) {
      return;
    }
    const inputs = this.otpInputs.toArray();
    for (let i = 0; i < digits.length && index + i < 6; i++) {
      inputs[index + i].nativeElement.value = digits[i];
    }
    this.updateOtp();
    this.otpError = '';
    const lastIndex = Math.min(index + digits.length - 1, 5);
    inputs[lastIndex]?.nativeElement.focus();
  }

  updateOtp(): void {
    this.otp = this.otpInputs.toArray().map(input => input.nativeElement.value).join('');
  }

  onOtpSubmit(): void {
    this.updateOtp();
    if (!this.otp) {
      this.otpError = 'OTP is required.';
      return;
    }
    if (!/^\d+$/.test(this.otp)) {
      this.otpError = 'Please enter a valid OTP.';
      return;
    }
    if (this.otp.length !== 6) {
      this.otpError = 'OTP must be 6 digits.';
      return;
    }
    this.otpError = '';
    const payload = { email: this.email, otp: this.otp };
    console.log('OTP payload:', payload);
    this.verifyOtp(payload);
  }

  verifyOtp(payload: any) {
    this.loadingService.show();
    this.authService.verifyOtp(payload).subscribe({
      next: (response: any) => {
        this.loadingService.hide();
        if (response.status) {
          if (response.existingUser) {
            this.toastService.show('OTP verified successfully', 'success');
            this.otpForm.reset();
            this.showLogin = false;
            this.showOtp = false;
            this.showRegister = false;
            this.router.navigate(['/']);
          } else {
            console.log('Verify OTP API response:', response);
            this.registerForm.patchValue({
              email: this.email
            });
            this.otpForm.reset();
            this.showLogin = false;
            this.showOtp = false;
            this.showRegister = true;
          }
        } else {
          this.toastService.show(response.message, 'error');
        }
      },
      error: (error: any) => {
        this.loadingService.hide();
        this.toastService.show('Something went wrong. Please try again.', 'error');
        console.error('Verify OTP API error:', error);
      }
    });
  }

  // ********************** Resent Otp ********************** \\

  startResendTimer(): void {
    if (this.resendTimerSubscription) {
      this.resendTimerSubscription.unsubscribe();
    }
    this.resendTime.set(300);
    this.canResendOtp.set(false);
    this.resendTimerSubscription = interval(1000).subscribe(() => {
      const currentTime = this.resendTime();
      if (currentTime > 0) {
        this.resendTime.set(currentTime - 1);
      } else {
        this.canResendOtp.set(true);
        this.resendTimerSubscription.unsubscribe();
      }
    });
  }

  getResendTime(): string {
    const time = this.resendTime();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  resendOtp(): void {
    if (!this.canResendOtp) {
      return;
    }
    const payload = {
      email: this.email
    };
    // this.loadingService.show();
    // this.authService.resendOtp(payload).subscribe({
    //   next: (response: any) => {
    //     this.loadingService.hide();
    //     if (response.status) {
    //       this.otpForm.reset();
    //       this.otp = '';
    //       this.otpError = '';
    //       this.startResendTimer();
    //       this.toastService.show('OTP resent successfully', 'success');
    //     } else {
    //       this.toastService.show('Failed to resend OTP. Please try again.', 'error');
    //     }
    //   },
    //   error: (error: any) => {
    //     this.loadingService.hide();
    //     console.error('Resend OTP error:', error);
    //     this.toastService.show('Something went wrong. Please try again.', 'error');
    //   }

    // });
  }

  // ********************** Register ********************** \\

  initializeRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      mobileNumber: [''],
      email: [{ value: this.email, disabled: true }],
      gender: [''],
      agree: [false]
    });
  }

  validateIndianMobile(mobile: string): boolean {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }

  onRegisterSubmit(): void {
    this.registerErrors = {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      gender: '',
      agree: ''
    };
    const firstName = this.registerForm.get('firstName')?.value?.trim();
    const lastName = this.registerForm.get('lastName')?.value?.trim();
    const mobileNumber = this.registerForm.get('mobileNumber')?.value?.trim();
    const gender = this.registerForm.get('gender')?.value;
    const agree = this.registerForm.get('agree')?.value;
    if (!firstName) {
      this.registerErrors.firstName = 'First Name is required.';
    } else if (firstName.length < 1 || firstName.length > 50) {
      this.registerErrors.firstName =
        'First Name must be between 1 and 50 characters.';
    }
    if (!lastName) {
      this.registerErrors.lastName = 'Last Name is required.';
    } else if (lastName.length < 1 || lastName.length > 50) {
      this.registerErrors.lastName =
        'Last Name must be between 1 and 50 characters.';
    }
    if (!mobileNumber) {
      this.registerErrors.mobileNumber =
        'Mobile Number is required.';
    } else if (!this.validateIndianMobile(mobileNumber)) {
      this.registerErrors.mobileNumber =
        'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!gender) {
      this.registerErrors.gender = 'Please select your gender.';
    }
    if (!agree) {
      this.registerErrors.agree =
        'Please agree to the Privacy Policy and Terms & Conditions.';
    }
    if (
      this.registerErrors.firstName ||
      this.registerErrors.lastName ||
      this.registerErrors.mobileNumber ||
      this.registerErrors.gender ||
      this.registerErrors.agree
    ) {
      return;
    }
    const formData = this.registerForm.getRawValue();
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobile: formData.mobileNumber,
      email: formData.email,
      gender: formData.gender,
      termsAccepted: formData.agree
    };
    console.log('Register payload:', payload);
    this.registration(payload);
  }

  registration(payload: any) {
    this.loadingService.show();
    this.authService.register(payload).subscribe({
      next: (response: any) => {
        this.loadingService.hide();
        if (response.status) {
          this.registerForm.reset();
          this.showLogin = false;
          this.showOtp = false;
          this.showRegister = false;
          this.router.navigate(['/']);
          this.toastService.show(response.message, 'success');
        } else {
          this.toastService.show(response.message, 'error');
        }
      },
      error: (error: any) => {
        this.loadingService.hide();
        console.error('Resend OTP error:', error);
        this.toastService.show('Something went wrong. Please try again.', 'error');
      }
    });
  }


}
