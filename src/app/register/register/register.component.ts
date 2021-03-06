import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class RegisterComponent implements OnInit {
	myGroup: FormGroup;
	authService: AuthService;
	store: Store<AppState>;
	router: Router;
	constructor(authService: AuthService, store: Store<AppState>, router: Router) {
		this.authService = authService;
		this.store = store;
		this.router = router;
	}
	errorMessage = '';
	successMessage = '';

	passResetSent: boolean = false;
	ngOnInit() {
		this.myGroup = new FormGroup({
			firstName: new FormControl(),
			email: new FormControl(),
			password: new FormControl,
	 });
	}

	tryRegister(value) {
		this.authService.doRegister(value)
			.then(res => {
				console.log(res);
				this.errorMessage = "";
				this.successMessage = "Your account has been created";
			}, err => {
				console.log(err);
				this.errorMessage = err.message;
				this.successMessage = "";
			})
	}

	forgotPassword(value) {
		this.authService.resetPasswordInit(value)
			.then(res => { this.passResetSent = true; }, err => {console.log(err)} );
	}
	async tryLogin(value) {
		this.authService.doLogin(value)
			.then(res => {
				console.log(res);
				this.authService.computeUserModel(res)
					.then(res=> {
						this.authService.addUser(res);
						if (res) {
							this.router.navigate(['/landing-page'])
						}
					})
			}, err => {
				console.log(err);
			});
	}

}
