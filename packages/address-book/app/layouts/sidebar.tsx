import { useEffect, useState } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigation,
  useSubmit,
} from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";

// export const clientLoader = async () => {
export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
};

// SSRされたHTMLにハイドレーションする場合のオプション
// clientLoader.hydrate = true as const;

export const SidebarLayout = ({ loaderData }: Route.ComponentProps) => {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const [query, setQuery] = useState(q || "");

  // URLSearchParamsとinputの同期
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <>
      {/* サイドバー */}
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(e) => {
              const isFirstSearch = q === null;
              submit(e.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`/contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts found</p>
          )}
        </nav>
      </div>
      {/* 子画面 */}
      <div
        id="detail"
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
};

export default SidebarLayout;
