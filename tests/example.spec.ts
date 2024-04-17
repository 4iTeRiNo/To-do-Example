import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

const TODO_ITEMS = ["Тестовое задание", "Прекрасный код", "Покрытие тестами"];

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    // Make sure the list only has one todo item.
    await expect(page.getByTestId("todo-title")).toHaveText([TODO_ITEMS[0]]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press("Enter");

    // Make sure the list now has two todo items.
    await expect(page.getByTestId("todo-title")).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);
  });

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // Create one todo item.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    // Check that input is empty.
    await expect(newTodo).toBeEmpty();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // Create two items.
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }

    // Check first item.
    const firstTodo = page.getByTestId("todo-item").nth(0);

    // await firstTodo.getByRole("checkbox").check();
    await firstTodo.getByRole("checkbox").dispatchEvent("click");
    await expect(firstTodo).toHaveClass("completed");

    // Check second item.
    const secondTodo = page.getByTestId("todo-item").nth(1);
    await expect(secondTodo).not.toHaveClass("completed");
    await secondTodo.getByRole("checkbox").dispatchEvent("click");

    // Assert completed class.
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).toHaveClass("completed");
  });

  test("should allow me to un-mark items as complete", async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // Create two items.
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }

    const firstTodo = page.getByTestId("todo-item").nth(0);
    const secondTodo = page.getByTestId("todo-item").nth(1);
    const firstTodoCheckbox = firstTodo.getByRole("checkbox");

    await firstTodoCheckbox.dispatchEvent("click");
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");

    await firstTodoCheckbox.dispatchEvent("click");
    await expect(firstTodo).not.toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
  });
});

test.describe("Clear completed button", () => {
  test("should display the correct text", async ({ page }) => {
    await page.locator(".todo-list li .toggle").first().dispatchEvent("click");
    await expect(
      page.getByRole("button", { name: "Clear completed" })
    ).toBeVisible();
  });

  test("should remove completed items when clicked", async ({ page }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).getByRole("checkbox").check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should be hidden when there are no items that are completed", async ({
    page,
  }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(
      page.getByRole("button", { name: "Clear completed" })
    ).toBeHidden();
  });
});

test.describe("Persistence", () => {
  test("should persist its data", async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }

    const todoItems = page.getByTestId("todo-item");
    const firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
    await firstTodoCheck.dispatchEvent("click");
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(["completed", ""]);

    // Ensure there is 1 completed item.

    // Now reload.
    await page.reload();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(["completed", ""]);
  });
});

/* test.describe("Routing", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    // make sure the app had a chance to save updated todos in storage
    // before navigating to a new view, otherwise the items can get lost :(
    // in some frameworks like Durandal
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  });

  test("should allow me to display active items", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole("link", { name: "Active" }).click();
    await expect(todoItem).toHaveCount(2);
    await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should respect the back button", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    await test.step("Showing all items", async () => {
      await page.getByRole("link", { name: "All" }).click();
      await expect(todoItem).toHaveCount(3);
    });

    await test.step("Showing active items", async () => {
      await page.getByRole("link", { name: "Active" }).click();
    });

    await test.step("Showing completed items", async () => {
      await page.getByRole("link", { name: "Completed" }).click();
    });

    await expect(todoItem).toHaveCount(1);
    await page.goBack();
    await expect(todoItem).toHaveCount(2);
    await page.goBack();
    await expect(todoItem).toHaveCount(3);
  });

  test("should allow me to display completed items", async ({ page }) => {
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole("link", { name: "Completed" }).click();
    await expect(page.getByTestId("todo-item")).toHaveCount(1);
  });

  test("should allow me to display all items", async ({ page }) => {
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole("link", { name: "Active" }).click();
    await page.getByRole("link", { name: "Completed" }).click();
    await page.getByRole("link", { name: "All" }).click();
    await expect(page.getByTestId("todo-item")).toHaveCount(3);
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    await expect(page.getByRole("link", { name: "All" })).toHaveClass(
      "selected"
    );

    //create locators for active and completed links
    const activeLink = page.getByRole("link", { name: "Active" });
    const completedLink = page.getByRole("link", { name: "Completed" });
    await activeLink.click();

    // Page change - active items.
    await expect(activeLink).toHaveClass("selected");
    await completedLink.click();

    // Page change - completed items.
    await expect(completedLink).toHaveClass("selected");
  });
}); */
