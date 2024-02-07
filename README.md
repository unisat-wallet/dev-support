## UniSat open-api Demo

UniSat Developer Service is open to community developers, allowing you to explore the world of Bitcoin and Ordinals. You can deploy your own inscribing services, build wallet applications, develop browsers, and much more using the API.

### Getting an API Key
To use the OpenAPI, please feel free to send us(contact@unisat.io) an email, and we will send you with an free-plan API KEY.

When you obtain the API key, please add it to the request header with the Authorization format as follows:
``` shell
curl -X 'GET' \
  'https://open-api.unisat.io/v1/indexer/blockchain/info' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

#### Market api
[Documentation](https://docs.unisat.io/dev/unisat-developer-service/unisat-marketplace)

[Online Demo](https://demo.unisat.io/market)

[Source of Online Demo](./brc20-market-demo)

#### brc20-swap api
[Documentation](https://docs.unisat.io/dev/unisat-developer-service/brc20-swap)

[Online Demo](https://demo.unisat.io/swap)

[Source of Online Demo](./brc20-swap-demo)

#### Inscribe api
[Documentation](https://docs.unisat.io/dev/unisat-developer-service/unisat-inscribe)

[Online Demo](https://demo.unisat.io/inscribe)

[Source of Online Demo](./unisat-inscribe-demo)

#### Wallet api
[Documentation](https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet)

[Online Demo](https://demo.unisat.io/wallet)

[Source of Online Demo](./unisat-web3-demo)


