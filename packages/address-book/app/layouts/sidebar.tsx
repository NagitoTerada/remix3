import { Form, Link, NavLink, Outlet, useNavigation } from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";

// export const clientLoader = async () => {
export const loader = async () => {
  const contacts = await getContacts();
  return { contacts };
};

// SSRされたHTMLにハイドレーションする場合のオプション
// clientLoader.hydrate = true as const;

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData;
  const navigation = useNavigation();
  return (
    <>
      {/* サイドバー */}
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form id="search-form" role="search">
            <input
              aria-label="Search contacts"
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={true} id="search-spinner" />
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
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
