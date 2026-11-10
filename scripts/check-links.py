import os
import re
import sys

broken_links = []
for folder, _, file_names in os.walk("."):
    if ".git" in folder.split(os.sep):
        continue
    for file_name in file_names:
        if file_name != "index.html":
            continue
        page_path = os.path.join(folder, file_name)
        with open(page_path) as page_file:
            page = page_file.read()
        for href in re.findall(r'<a href="([^"#]+)"', page):
            if href.startswith(("http://", "https://")):
                continue
            target = os.path.normpath(os.path.join(folder, href))
            if not any(os.path.isfile(candidate) for candidate in (target, os.path.join(target, "index.html"), os.path.join(target, "README.md"))):
                broken_links.append(f"{page_path}: {href}")

print("\n".join(broken_links) or "No broken links.")
sys.exit(1 if broken_links else 0)
