## Testing

Testing is more important than shipping. If you have no tests or an inadequate amount, then every time you ship code you won't be sure that you didn't break anything.
Deciding on what constitutes an adequate amount is up to your team, but having 100% coverage (all statements and branches)
is how you achieve very high confidence and developer peace of mind. This means that in addition to having a great testing framework, you also need to use a good [coverage tool](https://github.com/gotwarlost/istanbul).

There's no excuse to not write tests. There are [plenty of good JS test frameworks](http://jstherightway.org/#testing-tools) with typings support for TypeScript, so find one that your team prefers. When you find one that works for your team, then aim to always write tests for every new feature/module you introduce. If your preferred method is Test Driven Development (TDD), that is great, but the main point is to just make sure you are reaching your coverage goals before launching any feature, or refactoring an existing one.

### The three laws of TDD

1. You are not allowed to write any production code unless it is to make a failing unit test pass.

2. You are not allowed to write any more of a unit test than is sufficient to fail, and; compilation failures are failures.

3. You are not allowed to write any more production code than is sufficient to pass the one failing unit test.

### F.I.R.S.T. rules

Clean tests should follow the rules:

- **Fast** tests should be fast because we want to run them frequently.

- **Independent** tests should not depend on each other. They should provide same output whether run independently or all together in any order.

- **Repeatable** tests should be repeatable in any environment and there should be no excuse for why they fail.

- **Self-Validating** a test should answer with either _Passed_ or _Failed_. You don't need to compare log files to answer if a test passed.

- **Timely** unit tests should be written before the production code. If you write tests after the production code, you might find writing tests too hard.

### Single concept per test

Tests should also follow the _Single Responsibility Principle_. Make only one assert per unit test.

**Bad:**

```ts
import { assert } from 'chai';

describe('AwesomeDate', () => {
  it('handles date boundaries', () => {
    let date: AwesomeDate;

    date = new AwesomeDate('1/1/2015');
    assert.equal('1/31/2015', date.addDays(30));

    date = new AwesomeDate('2/1/2016');
    assert.equal('2/29/2016', date.addDays(28));

    date = new AwesomeDate('2/1/2015');
    assert.equal('3/1/2015', date.addDays(28));
  });
});
```

**Good:**

```ts
import { expect, describe, it } from 'bun:test';

describe('AwesomeDate', () => {
  it('handles 30-day months', () => {
    const date = new AwesomeDate('1/1/2015');
    expect(date.addDays(30)).toMatchInlineSnapshot(\`'1/31/2015'\`);
  });

  it('handles leap year', () => {
    const date = new AwesomeDate('2/1/2016');
    expect(date.addDays(28)).toMatchInlineSnapshot(\`'2/29/2016'\`);
  });

  it('handles non-leap year', () => {
    const date = new AwesomeDate('2/1/2015');
    expect(date.addDays(28)).toMatchInlineSnapshot(\`'3/1/2015'\`);
  });
});
```

### Prefer Inline Snapshots for Literal Comparisons

When testing against specific literal values (strings, numbers, simple objects), prefer using inline snapshots (`expect().toMatchInlineSnapshot()`) over direct equality assertions (`assert.equal`, `expect().toEqual()`). Inline snapshots make tests more readable by placing the expected value directly in the test file, automatically update when the value changes (requiring explicit review), and reduce the chance of typos in expected values.

**Bad:**

```ts
import { assert } from 'chai'; // Or: import { expect } from 'bun:test';

function getUserGreeting(name: string): string {
  return `Hello, ${name}!`;
}

describe('getUserGreeting', () => {
  it('should return the correct greeting', () => {
    const name = 'Alice';
    const greeting = getUserGreeting(name);
    assert.equal('Hello, Alice!', greeting); // Or: expect(greeting).toEqual('Hello, Alice!');
  });
});
```

**Good:**

```ts
import { expect, describe, it } from 'bun:test';

function getUserGreeting(name: string): string {
  return `Hello, ${name}!`;
}

describe('getUserGreeting', () => {
  it('should return the correct greeting', () => {
    const name = 'Alice';
    const greeting = getUserGreeting(name);
    expect(greeting).toMatchInlineSnapshot(`'Hello, Alice!'`);
  });
});
```

### The name of the test should reveal its intention

When a test fails, its name is the first indication of what may have gone wrong.

**Bad:**

```ts
describe('Calendar', () => {
  it('2/29/2020', () => {
    // ...
  });

  it('throws', () => {
    // ...
  });
});
```

**Good:**

```ts
describe('Calendar', () => {
  it('should handle leap year', () => {
    // ...
  });

  it('should throw when format is invalid', () => {
    // ...
  });
});
```
