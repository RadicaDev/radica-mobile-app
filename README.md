# Radica Mobile App

Radica mobile app allows you to verify product certified with Radica technology by scanning NFC tags.

## Installation

### Requirements

- Node.js
- Apple Developer Account (for iOS)

> [!NOTE]
> You need to have an Apple Developer Account to install the app on your iPhone. This is required since the app uses the NFC api which is not available on the simulator. You must also configure your account in Xcode. You can follow the expo guide [here](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=development-build&buildEnv=local).

### Run Locally

Clone the project

```bash
git clone https://github.com/RadicaDev/radica-mobile-app.git
```

Go to the project directory

```bash
  cd radica-mobile-app
```

Install dependencies

```bash
npm install
```

To run the project locally first setup the blockchain environment by following the instructions in the [radica-contracts](https://github.com/RadicaDev/radica-contracts.git) repository.

Be sure to set the right parameters in `app-settings.ts` file.

> [!NOTE]
> The `signerAddress` in the `app-settings.ts` file should be the address you used to sign the NFC tags in the `radica-contracts` repository. You can find it in `radica-contracts/crypto-keys/address.ts`.

#### Development build

To install a development build on your iPhone, run

```bash
  npx expo run:ios --device
```

Then you can run the following command to start the development server future times

```bash
  npx expo start
```

#### Production build

To install a production build on your iPhone, run

```bash
  npx expo build:ios --device --configuration Release
```

You won't need to run a server with the production build.

## Usage/Examples

The app has three main tabs:

- **Verify**: Allows you to scan a Radica NFC tag and verify its authenticity.
- **Wallet**: Allows you to see your wallet balance and owned product.
- **Online**: Allows you to verify a product by entering its address.

## License

[MIT](https://choosealicense.com/licenses/mit/)
