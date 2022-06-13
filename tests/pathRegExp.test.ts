import { denock } from "../mod.ts";
import { assertEquals  } from "../src/deps.ts"


Deno.test("Denock(): given a regular expresion path it could match it", async () => {
    const intereceptor = denock({
        host: 'localhost',
        path: /hell[ou]/,
        method: 'GET',
        protocol: "http",
        replyStatus: 201,
        interception: 2,
        responseBody: {
            return: 'world'
        }
    });

    const response = await fetch('http://localhost/hello')
    const bodyOne = await response.json();

    const responseTwo = await fetch('http://localhost/hellu');
    const bodyTwo = await responseTwo.json(); 

    assertEquals(bodyTwo.return, 'world');
    assertEquals(bodyOne.return, 'world'); 

    intereceptor.destroy();
})