import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
    duration: '10s'
};

const frontendUrl = 'http://unibasement.g6.csse6400.xyz/'
const backendUrl = 'http://unibasementBackend-2061383905.us-east-1.elb.amazonaws.com:8080/api/'

export default function () {
    let res = http.get(frontendUrl);
    check(res, {
        "frontend status was 200": (r) => r.status === 200,
    });

    res = http.get(backendUrl + 'courses');
    check(res, {
        "backend status was 200": (r) => r.status === 200,
        "backend body contains list of courses": (r) => r.json().length > 0 && !!r.json()[0].courseCode,
    });

    sleep(0.1);
}

export function handleSummary(output) {
    const formatted = output.root_group.checks.map((c) => `'${c.name}': ${c.passes}/${c.passes + c.fails}`)
    return { stdout: `---\n[${new Date()}]\n` + formatted.join('\n') + '\n---\n' }
}