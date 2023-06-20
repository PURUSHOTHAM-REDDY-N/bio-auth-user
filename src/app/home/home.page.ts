import {Component} from '@angular/core';
import {BiometricOptions, BiometryType, NativeBiometric} from "@capgo/capacitor-native-biometric";
import {Geolocation} from '@capacitor/geolocation';
import {Position} from "@capacitor/geolocation/dist/esm/definitions";
import {HttpClient} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    authentication: boolean = false

    public position: Position

    biometricType: string = "check availability first"

    latitude:string

    longitude:string


    constructor(private router: Router,private http: HttpClient,public loadingController: LoadingController) {
    }

    ngOnInit() {
        // this.printCurrentPosition()
    }

    goToUserDetails() {
        this.router.navigate(['/userdetails/userdetails', localStorage.getItem("username")]);
    }

    async checkIn() {

        const loading1 = await this.loadingController.create({
            message: '',
            spinner:'bubbles'
        });

        await loading1.present();

        await Geolocation.getCurrentPosition(
            {timeout: 15000, enableHighAccuracy: true, maximumAge: 0}).then((value)=>{
            this.latitude=value.coords.latitude.toString();
            this.longitude=value.coords.longitude.toString()
        })

        const checkinData = {
            username:localStorage.getItem("username"),
            name: localStorage.getItem("name"),
            inTime:new Date().toISOString(),
            checkInLocation:{latitude:this.latitude,longitude:this.longitude}
        };

        this.http.post('https://basic-auth-app.vercel.app/api/user/checkIn', checkinData).subscribe(
            (response: any) => {

                console.log(response)

            },

            (error) => {
                console.log(error.status)
                loading1.dismiss()

                console.log(error)
                console.log('Invalid username or password');
            }
        );

    }

    async checkOut() {

        const loading = await this.loadingController.create({
            message: '',
            spinner:'bubbles'
        });

        await loading.present();

        await Geolocation.getCurrentPosition(
            {timeout: 15000, enableHighAccuracy: true, maximumAge: 0}).then((value)=>{
            this.latitude=value.coords.latitude.toString();
            this.longitude=value.coords.longitude.toString()
        })
        const checkOutData = {
            username:localStorage.getItem("username"),
            name: localStorage.getItem("name"),
            outTime:new Date().toISOString(),
            checkOutLocation:{latitude:this.latitude,longitude:this.longitude}
        };

        this.http.post('https://basic-auth-app.vercel.app/api/user/checkout', checkOutData).subscribe(
            (response: any) => {
                loading.dismiss();

                console.log(response)

            },
            (error) => {
                console.log(error.status)
                loading.dismiss();
                console.log(error)
                console.log('Invalid username or password');
            }
        );

    }


    // async checkAvailable() {
    //     const result2 = await NativeBiometric.isAvailable({useFallback: true});
    //     console.log(this.biometricType)
    //
    //     await this.printCurrentPosition()
    //
    //     switch (result2.biometryType) {
    //         case BiometryType.FACE_AUTHENTICATION:
    //             this.biometricType = "Only face recognition";
    //             break;
    //         case BiometryType.FACE_ID:
    //             this.biometricType = "Apple face Id Available"
    //             break;
    //         case BiometryType.FINGERPRINT:
    //             this.biometricType = "Only finger print available"
    //             break;
    //         case BiometryType.IRIS_AUTHENTICATION:
    //             this.biometricType = "Iris Auth available"
    //             break;
    //         case BiometryType.MULTIPLE:
    //             this.biometricType = "Multiple authentication available"
    //             break;
    //         case BiometryType.NONE:
    //             this.biometricType = "No biometric implemented"
    //             break;
    //         case BiometryType.TOUCH_ID:
    //             this.biometricType = "Touch Id is available"
    //             break;
    //
    //     }
    // }

    async printCurrentPosition() {
        const coordinates = await Geolocation.getCurrentPosition(
            {timeout: 15000, enableHighAccuracy: true, maximumAge: 0})

        if (coordinates) {
            this.position = coordinates;
        }

        console.log('Current position:', coordinates);
    };


    // bioAvailable() {
    //   NativeBiometric.isAvailable().then(value => console.log(value))
    //
    // }
}
