import { Context } from "hono";
import { sign } from "hono/jwt";
import { DB, User } from "./base";
import { or, eq } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import { JWTSecretKey } from "../config";

function md5(r: string): string {
    function n(r: number, n: number): number {
        var t = (65535 & r) + (65535 & n);
        return (r >> 16) + (n >> 16) + (t >> 16) << 16 | 65535 & t;
    }
    function t(r: number, t: number, u: number, e: number, a: number, c: number): number {
        var f = n(n(t, r), n(e, c));
        return n(f << a | f >>> 32 - a, u);
    }
    function u(r: number, n: number, u: number, e: number, a: number, c: number, f: number): number {
        return t(n & u | ~n & e, r, n, a, c, f);
    }
    function e(r: number, n: number, u: number, e: number, a: number, c: number, f: number): number {
        return t(n & e | u & ~e, r, n, a, c, f);
    }
    function a(r: number, n: number, u: number, e: number, a: number, c: number, f: number): number {
        return t(n ^ u ^ e, r, n, a, c, f);
    }
    function c(r: number, n: number, u: number, e: number, a: number, c: number, f: number): number {
        return t(u ^ (n | ~e), r, n, a, c, f);
    }
    const f: number[] = [];
    const o = 8 * r.length;
    let i = 1732584193;
    let h = -271733879;
    let v = -1732584194;
    let A = 271733878;
    let d = 0;
    for (d = 0; d < o; d += 8) {
        f[d >> 5] |= (255 & r.charCodeAt(d / 8)) << d % 32;
    }
    f[o >> 5] |= 128 << o % 32;
    f[14 + (o + 64 >>> 9 << 4)] = o;
    for (d = 0; d < f.length; d += 16) {
        const g = i;
        const l = h;
        const y = v;
        const b = A;
        h = c(h = c(h = c(h = c(h = a(h = a(h = a(h = a(h = e(h = e(h = e(h = e(h = u(h = u(h = u(h = u(h,
            v = u(v, A = u(A, i = u(i, h, v, A, f[d + 0], 7, -680876936), h, v, f[d + 1], 12, -389564586),
                i, h, f[d + 2], 17, 606105819), A, i, f[d + 3], 22, -1044525330),
            v = u(v, A = u(A, i = u(i, h, v, A, f[d + 4], 7, -176418897), h, v, f[d + 5], 12, 1200080426),
                i, h, f[d + 6], 17, -1473231341), A, i, f[d + 7], 22, -45705983),
            v = u(v, A = u(A, i = u(i, h, v, A, f[d + 8], 7, 1770035416), h, v, f[d + 9], 12, -1958414417),
                i, h, f[d + 10], 17, -42063), A, i, f[d + 11], 22, -1990404162),
            v = u(v, A = u(A, i = u(i, h, v, A, f[d + 12], 7, 1804603682), h, v, f[d + 13], 12, -40341101),
                i, h, f[d + 14], 17, -1502002290), A, i, f[d + 15], 22, 1236535329),
            v = e(v, A = e(A, i = e(i, h, v, A, f[d + 1], 5, -165796510), h, v, f[d + 6], 9, -1069501632),
                i, h, f[d + 11], 14, 643717713), A, i, f[d + 0], 20, -373897302),
            v = e(v, A = e(A, i = e(i, h, v, A, f[d + 5], 5, -701558691), h, v, f[d + 10], 9, 38016083),
                i, h, f[d + 15], 14, -660478335), A, i, f[d + 4], 20, -405537848),
            v = e(v, A = e(A, i = e(i, h, v, A, f[d + 9], 5, 568446438), h, v, f[d + 14], 9, -1019803690),
                i, h, f[d + 3], 14, -187363961), A, i, f[d + 8], 20, 1163531501),
            v = e(v, A = e(A, i = e(i, h, v, A, f[d + 13], 5, -1444681467), h, v, f[d + 2], 9, -51403784),
                i, h, f[d + 7], 14, 1735328473), A, i, f[d + 12], 20, -1926607734),
            v = a(v, A = a(A, i = a(i, h, v, A, f[d + 5], 4, -378558), h, v, f[d + 8], 11, -2022574463),
                i, h, f[d + 11], 16, 1839030562), A, i, f[d + 14], 23, -35309556),
            v = a(v, A = a(A, i = a(i, h, v, A, f[d + 1], 4, -1530992060), h, v, f[d + 4], 11, 1272893353),
                i, h, f[d + 7], 16, -155497632), A, i, f[d + 10], 23, -1094730640),
            v = a(v, A = a(A, i = a(i, h, v, A, f[d + 13], 4, 681279174), h, v, f[d + 0], 11, -358537222),
                i, h, f[d + 3], 16, -722521979), A, i, f[d + 6], 23, 76029189),
            v = a(v, A = a(A, i = a(i, h, v, A, f[d + 9], 4, -640364487), h, v, f[d + 12], 11, -421815835),
                i, h, f[d + 15], 16, 530742520), A, i, f[d + 2], 23, -995338651),
            v = c(v, A = c(A, i = c(i, h, v, A, f[d + 0], 6, -198630844), h, v, f[d + 7], 10, 1126891415),
                i, h, f[d + 14], 15, -1416354905), A, i, f[d + 5], 21, -57434055),
            v = c(v, A = c(A, i = c(i, h, v, A, f[d + 12], 6, 1700485571), h, v, f[d + 3], 10, -1894986606),
                i, h, f[d + 10], 15, -1051523), A, i, f[d + 1], 21, -2054922799),
            v = c(v, A = c(A, i = c(i, h, v, A, f[d + 8], 6, 1873313359), h, v, f[d + 15], 10, -30611744),
                i, h, f[d + 6], 15, -1560198380), A, i, f[d + 13], 21, 1309151649),
            v = c(v, A = c(A, i = c(i, h, v, A, f[d + 4], 6, -145523070), h, v, f[d + 11], 10, -1120210379),
                i, h, f[d + 2], 15, 718787259), A, i, f[d + 9], 21, -343485551),
            i = n(i, g), h = n(h, l), v = n(v, y), A = n(A, b);
    }
    const m = [i, h, v, A];
    const C = "0123456789abcdef";
    let j = "";
    for (d = 0; d < 4 * m.length; d++) {
        j += C.charAt(m[d >> 2] >> d % 4 * 8 + 4 & 15) + C.charAt(m[d >> 2] >> d % 4 * 8 & 15);
    }
    return j;
}

export async function iLoginPost(a: Context) {
    const body = await a.req.formData()
    const text = body.get('text')?.toString() || ''
    const pass = body.get('pass')?.toString() || ''
    const data = (await DB
        .select()
        .from(User)
        .where(or(eq(User.username, text), eq(User.email, text)))
    )[0] || null
    if (!data || md5(pass + data.salt) != data.password) { return a.notFound() }
    const { password, salt, ...payload } = data
    setCookie(a, 'JWT', await sign(payload, JWTSecretKey))
    return a.text('ok')
}

export async function iLogoutPost(a: Context) {
    deleteCookie(a, 'JWT')
    return a.text('ok')
}