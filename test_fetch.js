async function test() {
    try {
        const res = await fetch("http://localhost:3000/api/v1/config/language");
        console.log(res.status);
    } catch(e) {
        console.error(e);
    }
}
test();
