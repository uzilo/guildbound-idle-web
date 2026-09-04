import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";

// Testing-library's automatic cleanup requires global hooks; with explicit
// vitest imports we clean up manually between tests.
afterEach(cleanup);

function renderApp(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App shell", () => {
  it("renders the game header and primary navigation", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "Guildbound" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Guild/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Adventurers/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Inventory/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /More/ })).toBeInTheDocument();
  });

  it("shows the Guild screen by default", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "Guild" })).toBeInTheDocument();
  });

  it("navigates to a screen from the bottom navigation", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("link", { name: /Adventurers/ }));

    expect(screen.getByRole("heading", { name: "Adventurers" })).toBeInTheDocument();
  });

  it("shows a not-found screen for unknown routes", () => {
    renderApp("/nowhere");

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Return to the guild hall/ })).toBeInTheDocument();
  });
});
