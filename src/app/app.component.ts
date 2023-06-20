import {Component, Injector} from '@angular/core';
import {Platform} from "@ionic/angular";
import {BiometryType, NativeBiometric} from "@capgo/capacitor-native-biometric";
import {Position} from "@capacitor/geolocation/dist/esm/definitions";
import {App} from "@capacitor/app";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {


    checkBio: boolean = false

    authentication: boolean = false

    public position: Position

    biometricType: string = "check availability first"

    constructor(injector: Injector, private platform: Platform,) {
        this.initializeApp();

    }

    initializeApp() {

        this.platform.ready().then(() => {
            console.log("platform ready here")
            if (!this.checkBio) {
                if(localStorage.getItem("token")){
                this.checkBio = true

                this.performBiometricVerificatin()
                }


            }
            this.setupListener();

        });
    }

    async performBiometricVerificatin() {

        const result = await NativeBiometric.isAvailable({useFallback: true});

        if (!result.isAvailable) {
            console.log("inside ! result")
        }
        ;

        if (result.isAvailable) {
            console.log(result.biometryType)
        }


        const isFaceID = result.biometryType == BiometryType.FACE_ID;

        const verified = await NativeBiometric.verifyIdentity({
            reason: "User Attendance",
            title: "Log in",
            subtitle: "Maybe add subtitle here?",
            description: "Maybe a description too?",
            useFallback: true,
            maxAttempts: 4
        })
            .then(() => true)
            .catch(() => false);

        if (verified) {
            this.authentication = true
            // await this.printCurrentPosition()
        }

        if (!verified) {
            await App.exitApp()
            // this.positionReceived = false
        }
        ;

        // const credentials = await NativeBiometric.getCredentials({
        //     server: "www.example.com",
        // });
    };


    async setupListener() {
        App.addListener('appStateChange', ({isActive}) => {
            if (!isActive) {
                this.checkBio=false
                console.log('app background')
                // App went to background
                // Save anything you fear might be lost
            } else {
                if(!this.checkBio){
                    this.checkBio=true;
                    this.performBiometricVerificatin()
                console.log('app foreground')
                }
                // App went to foreground
                // restart things like sound playing
            }
        });
    }
}
