import { Context } from "hono";
import { Props, DB, Thread, User } from "./data";
import { Auth, Config, Counter, Pagination } from "./base";
import { desc, eq, getTableColumns } from 'drizzle-orm';
import { alias } from "drizzle-orm/sqlite-core";
import { TList } from "../bare/TList";

export interface TListProps extends Props {
    page: number
    pagination: number[]
    data: (typeof Thread.$inferSelect & {
        username: string | null;
        credits: number | null;
        gid: number | null;
        last_username: string | null;
    })[]
}

export async function tList(a: Context) {
    const i = await Auth(a)
    const page = parseInt(a.req.param('page') ?? '0') || 1
    const LastUser = alias(User, 'LastUser')
    const data = await DB
        .select({
            ...getTableColumns(Thread),
            username: User.username,
            credits: User.credits,
            gid: User.gid,
            last_username: LastUser.username,
        })
        .from(Thread)
        .leftJoin(User, eq(Thread.uid, User.uid))
        .leftJoin(LastUser, eq(Thread.last_uid, LastUser.uid))
        .where(eq(Thread.access, 0))
        .orderBy(desc(Thread.last_date))
        .offset((page - 1) * Config.get('page_size_t'))
        .limit(Config.get('page_size_t'))
    const pagination = Pagination(Config.get('page_size_t'), Counter.get('T') ?? 0, page, 2)
    const title = Config.get('site_name')
    return a.html(TList({ a, i, page, pagination, data, title }));
}