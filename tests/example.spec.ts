import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

const TODO_ITEMS = ["Тестовое задание", "Прекрасный код", "Покрытие тестами"];

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page }) => {
    const newTodo = page.getByPlaceholder("What needs to be done?");

    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    await expect(page.getByTestId("todo-title")).toHaveText([TODO_ITEMS[0]]);

    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press("Enter");

    await expect(page.getByTestId("todo-title")).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ page }) => {
    const firstTodo = page.getByTestId("todo-item").nth(0);
    const secondTodo = page.getByTestId("todo-item").nth(1);

    await firstTodo.getByRole("checkbox").dispatchEvent("click");
    await secondTodo.getByRole("checkbox").dispatchEvent("click");

    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).toHaveClass("completed");

    await firstTodo.getByRole("checkbox").dispatchEvent("click");
    await secondTodo.getByRole("checkbox").dispatchEvent("click");

    await expect(firstTodo).not.toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
  });
});

test.describe("Delete item", () => {
  test("the element should be deleted", async ({ page }) => {
    page.getByTestId("todo-item").nth(0);
    await page.getByTestId("delete").nth(0).dispatchEvent("click");
    await page.getByTestId("delete").nth(0).dispatchEvent("click");

    expect(page.getByPlaceholder("What needs to be done?"));
  });
});
