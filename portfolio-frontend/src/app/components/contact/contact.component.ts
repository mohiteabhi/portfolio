import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSent: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  sendEmail() {
    if (this.contactForm.invalid) {
      alert('Please fill in all fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.contactForm.value;

    emailjs
      .send(
        'service_piqezp9', // Replace with your EmailJS Service ID
        'template_oy6nr0n', // Replace with your EmailJS Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'DWwYBWhtwX6ekIcqG' // Replace with your EmailJS Public Key
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          this.isSent = true;
          this.contactForm.reset();
        },
        (error) => {
          console.log('FAILED...', error);
          alert('Something went wrong. Please try again.');
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
