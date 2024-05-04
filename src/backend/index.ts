import { Principal, Server } from 'azle';
import express, { Request, Response } from 'express';

import { CkbtcLedger, CkbtcMinter } from './ckbtc';

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

type User = {
    id: string,
    username: string,
    address: string,
}

let users: User[] = [];
const app = express();

app.use(express.json());

// Init ckBTC canisters
const ckbtcLedger = new CkbtcLedger(
    Principal.fromText(process.env.CKBTC_LEDGER_CANISTER_ID!)
);
const ckbtcMinter = new CkbtcMinter(
    Principal.fromText(process.env.CKBTC_MINTER_CANISTER_ID!)
);

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req: Request<any, any, { username: string }>, res: Response) => {
    const id = generateId();
    const address = await ckbtcMinter.getAddress(id);
    const user = {
        id: id.toString(),
        username: req.body.username,
        address
    };

    users = [
        ...users,
        user,
    ];

    res.status(200);
    res.send(user);
});

app.get('/users/:id/balance', async (req: Request<{ id: string }>, res: Response) => {
    const principal = Principal.fromText(req.params.id);
    const balance = await ckbtcLedger.getBalance(principal);

    res.json({ balance });
});

app.put('/users/:id/balance', async (req: Request<{ id: string }>, res: Response) => {
    const principal = Principal.fromText(req.params.id);
    await ckbtcMinter.updateBalance(principal);

    res.status(204);
    res.send();
});

app.post('/transfer', async (req: Request<any, any, { from: string, to: string, amount: number }>, res: Response) => {
    const { from, to, amount } = req.body;

    await ckbtcLedger.transfer(
        Principal.fromText(from),
        Principal.fromText(to),
        amount
    );

    res.status(204);
    res.send();
});

app.listen();
