import {Component} from '@angular/core';
import {BiometricOptions, BiometryType, NativeBiometric} from "@capgo/capacitor-native-biometric";
import {Geolocation} from '@capacitor/geolocation';
import {Position} from "@capacitor/geolocation/dist/esm/definitions";


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    authentication: boolean = false

    public position:Position

    biometricType: string = "check availability first"


    constructor() {
    }

    ngOnInit() {

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
            await this.printCurrentPosition()
        }

        if (!verified) {
            // this.positionReceived = false
        }
        ;

        const credentials = await NativeBiometric.getCredentials({
            server: "www.example.com",
        });
    };

    async checkAvailable() {
        const result2 = await NativeBiometric.isAvailable({useFallback: true});
        console.log(this.biometricType)

        await this.printCurrentPosition()

        switch (result2.biometryType) {
            case BiometryType.FACE_AUTHENTICATION:
                this.biometricType = "Only face recognition";
                break;
            case BiometryType.FACE_ID:
                this.biometricType = "Apple face Id Available"
                break;
            case BiometryType.FINGERPRINT:
                this.biometricType = "Only finger print available"
                break;
            case BiometryType.IRIS_AUTHENTICATION:
                this.biometricType = "Iris Auth available"
                break;
            case BiometryType.MULTIPLE:
                this.biometricType = "Multiple authentication available"
                break;
            case BiometryType.NONE:
                this.biometricType = "No biometric implemented"
                break;
            case BiometryType.TOUCH_ID:
                this.biometricType = "Touch Id is available"
                break;

        }
    }

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
