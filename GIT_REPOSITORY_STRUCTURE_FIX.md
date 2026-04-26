# Git Repository Structure Issue and Solution

## Goal

The GitHub repository `Angular_Learning_Project` should match the current local root folder:

```text
Angular Practice Project/
├── Data_Transfer_Project/
├── first-app-lesson from Documentation/
└── .gitignore
```

The root Git repository should be:

```text
/home/sazid/Documents/Angular Practice Project
```

## Issue Identified

The project originally had Angular app files directly in the root of the repository. Later, those files were moved into:

```text
first-app-lesson from Documentation/
```

Another folder, `Data_Transfer_Project/`, also existed inside the same root folder. That folder had its own `.git` directory, which made it a separate nested Git repository.

When running:

```bash
git add .
```

Git showed this warning:

```text
warning: adding embedded git repository: Data_Transfer_Project
```

This happened because Git detected `Data_Transfer_Project/.git`. If committed that way, GitHub would not store the real contents of `Data_Transfer_Project`. Instead, it would treat it like an embedded repository reference.

## How the Issue Was Confirmed

The repository root was checked with:

```bash
git rev-parse --show-toplevel
```

Result:

```text
/home/sazid/Documents/Angular Practice Project
```

The configured GitHub remote was checked with:

```bash
git remote -v
```

Result:

```text
origin  https://github.com/sksazid01/Angular_Learning_Project.git
```

Nested Git repositories were checked with:

```bash
find . -maxdepth 3 -name .git -type d
```

Before the fix, the result showed:

```text
./.git
./Data_Transfer_Project/.git
```

That confirmed the root folder was already the main Git repo, but `Data_Transfer_Project` was still a separate nested repo.

## Solution Applied

First, the folder structure change was committed so that `first-app-lesson from Documentation/` became a normal folder inside the root repository.

Then, to add `Data_Transfer_Project/` as a normal folder in the same root repository, its nested `.git` directory was moved out of the project:

```bash
mv Data_Transfer_Project/.git /tmp/Data_Transfer_Project.git.backup
```

The root `.gitignore` was updated so `Data_Transfer_Project/` was no longer ignored.

Then the project was staged, committed, and pushed:

```bash
git add .gitignore Data_Transfer_Project
git commit -m "Add data transfer project"
git push origin main
```

## Final Result

The repository now has only one Git root:

```text
/home/sazid/Documents/Angular Practice Project/.git
```

The current folder structure is tracked by the same GitHub repository:

```text
Angular_Learning_Project
├── Data_Transfer_Project/
├── first-app-lesson from Documentation/
└── .gitignore
```

GitHub now shows both Angular project folders inside the same repository root.

## Important Note

If a folder inside a Git repository contains its own `.git` directory, Git treats that folder as a separate repository. To add that folder's actual files to the parent repository, remove or move the nested `.git` directory first.

Do this only when you intentionally want the nested project to become part of the parent repository.
