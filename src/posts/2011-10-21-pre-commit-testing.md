---
layout : post 
title: Pre-commit testing
categories: git testing
summary: Utilize git's hooks to run tests prior to code check-ins
---
A pre-commit check is invoked right before a change is committed into the repository. This is a perfect place to run a quick smoke test to ensure that no broken code is ever checked in. Many source control systems, including the powerful Git, support pre-commit check as part of its hooks system. Unfortunately, based on my (limited) observations, leveraging pre-commit feature is not something every single developer practices yet.

For Git, the pre-commit script is a single file located under the hidden subdirectory .git. Creating a new one is as easy as:

```bash
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

from the top-level working directory of your repository. When the script is executed (right before a commit), the exit code will be inspected. If it is zero, the commit will continue. If it is non-zero, the commit is blocked and the working directory is left in the “dirty” state (you can inspect it with git diff).

Here is a simple pre-commit script (Unix only, sorry!) which prevents you to commit something on Sunday.

```bash
if [ `date +%w` -eq 6 || `date +%w` -eq 7 ]; then
  echo "No commits on the weekend."
  exit 1
fi
exit 0
```

Many software projects drive the test via make test. Provided that the exit code is suitably set, the pre-commit script needs only that line:

`make test`

For Node.js applications which use npm test to run the unit-test, making a pre-commit script is never been easier. The content of the script is as simple as:

`npm test`

Even style checking (which is usually very fast) can be carried out easily. For JavaScript-based apps, JSLint or JSHint fits perfectly in this situation.

`jslint app.js && jslint test/test.js`

If your script needs to be more sophisticated and handles all the files being added, copied, or modified, you can take advantage of Git filtering feature:

`git diff --cached --name-status --diff-filter=ACM`

By some piping machinery, or even just through xargs magic, the list of the files can be fed and processed appropriately. In most cases, especially large projects, checking only the files affected by the commit will save a lot of time.

This post is just a cursory look at pre-commit hook from Git. You may want to read more about various other hooks. Since it is quite common, you are also recommended to look for and investigate various tools out there (e.g. git-hooks) which let you manage multiple hooks easily. Pre-commit is easy to use and yet quite powerful. Invest a minute to set it up and it would save you from future nightmares!

**Update 6/26/2016**: Added syntax highlighting.
