# Qrder

_Please note that this project is scrapped and is no longer actively worked on_

Qrder is a food and drink ordering app that is done by using QR codes. The idea is that customers can visit restaurants, cafes or nightclubs and just scan the QR code on the table which will open up the menu from where they can order. Once they have ordered staff will recieve that order on their computer (the order will also say which table the order is coming from).

## Stack used

React on the front, NestJS (& Stripe for payments) on the back

## Why was it scrapped?

The project was a convenience offer rather than some offer that would actually benefit businesses because there are already waiters who are tasked with the job of taking peoples orders. Qrder couldn't eliminate the waiters job completely since someone would still have to serve food and drinks to the customers, which means that Qrder cannot actually offer monetary value to a business and couldn't justify charging a monthly fee for its service (in turn making it near impossible to run Qrder and its hosting fees profitably), which is why this project was scrapped

## Is it functional?

Yes. Although Qrder is a scrapped project, its core functionality has already been developed.

The features that haven't been fully developed are:

- Individual product analytics
- Group ordering
- Responsive design
- Full Stripe identification and cash withdraws support (only edge cases, core functionality is there)

Also please note that some components don't fully display all of the fetching states (loading, error success) as it was meant to be implemented at the end of the project, however everything still does correctly communicate with the backend.
