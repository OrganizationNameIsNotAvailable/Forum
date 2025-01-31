import { html } from "hono/html";
import { Props } from "../app/data";
import { Config, User_Notice } from "../app/base";

export async function Header(z: Props) {
    return html`
        <!DOCTYPE HTML>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${z.title}</title>
            <link rel="stylesheet" type="text/css" href="/a.css" />
            ${z.external_css ?? ''}
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
        <header class="header">
            <h1><a href="/">${Config.get('site_name')}</a></h1>
            <div>
                <input type="checkbox" id="menu-toggle" class="menu-toggle">
                <label for="menu-toggle" class="menu-toggle-label">菜单 ☰</label>
                <div class="header-buttons">
                    ${z.i ? html`
                        ${Object.hasOwn(z.a.req.param(), 'tid') ? html`
                        <a class="login-btn" href="/e/${z.a.req.param('tid')}">回复</a>
                        ` : html`
                        <a class="login-btn" href="/e">发表</a>
                        `}
                        <a class="login-btn" href="/n" style="${await User_Notice(z.i.uid) ? 'background:yellow' : ''}">通知</a>
                        <a class="login-btn" href="/i">设置</a>
                        <a class="login-btn" href="javascript:;" onclick="logout();">退出</a>
                    `: html`
                        <a class="login-btn" href="/auth">登录</a>
                    `}
                </div>
            </div>
        </header>
    `
}

export function Footer(z: Props) {
    return html`
        <script>
            async function logout() {
                if ((await fetch(new Request("/logout", {method: "POST"}))).ok) {
                    location.reload();
                }
            }
            window.addEventListener('load', function() {
                document.querySelectorAll('.date').forEach(element => {
                    element.innerHTML = new Date(parseInt(element.getAttribute('time_stamp'))*1000)
                                            .toLocaleString(undefined,{
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            });
                });
            });
        </script>
        <footer class="footer">
            <div class="footer-content">
                <ul class="footer-links">
                    ${Object.values(Config.get('friend_link') as { url: string, name: string; }[] ?? {}).map(item => html`
                    <li><a href="${item.url}" target="_blank">${item.name}</a></li>
                    `)}
                </ul>
            </div>
        </footer>
        </body>
        </html>
    `
}