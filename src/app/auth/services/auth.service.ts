import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // 🔥 Native SHA-256 hash using browser crypto
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  login(email: string, password: string, role: 'admin' | 'customer'): Observable<any> {

    // 🔥 HASH BEFORE SENDING (ASYNC SAFE)
    return from(this.hashPassword(password)).pipe(
      switchMap(hashedPassword => {

        return this.http.post<any>(`${this.API}/login`, {
          email,
          password: hashedPassword,   // 🔥 HASH GOES TO PAYLOAD
          role
        });

      })
    );
  }
}
