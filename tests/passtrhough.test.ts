import { denock } from "../mod.ts";
import { assertEquals  } from "../src/deps.ts"


Deno.test("Denock(): given a regular expresion path it could match it", async () => {
    const bob = denock({
        host: 'localhost',
        path: '/bob',
        method: 'GET',
        protocol: "http",
        replyStatus: 201,
        interception: 2,
        responseBody: {
            return: 'bob'
        },
        passthrough: true,
    });

    const alice = denock({
        host: 'localhost',
        path: '/alice',
        method: 'GET',
        protocol: "http",
        replyStatus: 201,
        interception: 2,
        responseBody: {
            return: 'alice'
        },
        passthrough: true,
    });

    const response = await fetch('http://localhost/alice')
    const bodyOne = await response.json();

    const responseTwo = await fetch('http://localhost/bob');
    const bodyTwo = await responseTwo.json(); 

    assertEquals(bodyOne.return, 'alice'); 
    assertEquals(bodyTwo.return, 'bob');

    alice.destroy();
    bob.destroy();
})