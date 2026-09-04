import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="page-placeholder">
      <h2 className="page-placeholder-title">Page not found</h2>
      <p className="page-placeholder-text">
        That path leads nowhere.{" "}
        <Link to="/" className="notfound-link">
          Return to the guild hall
        </Link>
        .
      </p>
    </section>
  );
}
