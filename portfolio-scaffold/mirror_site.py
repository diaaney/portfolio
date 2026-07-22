"""Archive the public Point + Talk page and its directly linked assets."""

from concurrent.futures import ThreadPoolExecutor, as_completed
from hashlib import sha256
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import json
import re


SOURCE = "https://diana.lu/point-n-talk"
OUTPUT = Path(__file__).parent / "point-n-talk"
ASSETS = OUTPUT / "assets"
URL_PATTERN = re.compile(r"https?://[^\s\"'<>\\)]+")
MAX_ASSET_BYTES = 100 * 1024 * 1024


class ResourceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if not value:
                continue
            if name in {"src", "poster", "href", "srcset", "style", "data-src"}:
                self.urls.update(URL_PATTERN.findall(value))


def is_asset(url):
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    path = parsed.path.lower()
    if host == "media.diana.lu":
        return True
    if host == "diana.lu":
        return path != "/point-n-talk" and bool(re.search(r"\.[a-z0-9]{2,6}$", path))
    return host.endswith("framerusercontent.com") or host.endswith("framer.com") or host.endswith("gstatic.com")


def download(url):
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (portfolio reference archive)"})
    with urlopen(request, timeout=40) as response:
        data = response.read(MAX_ASSET_BYTES + 1)
        if len(data) > MAX_ASSET_BYTES:
            raise ValueError("asset exceeds 100 MiB")
        content_type = response.headers.get_content_type()
    suffix = Path(urlparse(url).path).suffix.lower()
    if not re.fullmatch(r"\.[a-z0-9]{1,6}", suffix):
        suffix = {
            "text/css": ".css",
            "text/javascript": ".js",
            "application/javascript": ".js",
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "video/mp4": ".mp4",
        }.get(content_type, ".bin")
    name = sha256(url.encode()).hexdigest()[:20] + suffix
    target = ASSETS / name
    target.write_bytes(data)
    return {"url": url, "file": f"assets/{name}", "bytes": len(data), "sha256": sha256(data).hexdigest()}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(exist_ok=True)
    request = Request(SOURCE, headers={"User-Agent": "Mozilla/5.0 (portfolio reference archive)"})
    with urlopen(request, timeout=40) as response:
        html = response.read().decode("utf-8")
    (OUTPUT / "index.html").write_text(html, encoding="utf-8")

    parser = ResourceParser()
    parser.feed(html)
    urls = sorted(url for url in parser.urls if is_asset(unescape(url)))
    print(f"Found {len(urls)} directly linked assets")

    records = []
    errors = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(download, unescape(url)): url for url in urls}
        for future in as_completed(futures):
            url = futures[future]
            try:
                records.append(future.result())
            except Exception as error:
                errors.append({"url": url, "error": str(error)})

    offline = html
    for record in records:
        offline = offline.replace(record["url"], record["file"])
        offline = offline.replace(record["url"].replace("&", "&amp;"), record["file"])
    (OUTPUT / "offline.html").write_text(offline, encoding="utf-8")
    manifest = {"source": SOURCE, "assets": sorted(records, key=lambda row: row["url"]), "errors": errors}
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Saved {len(records)} assets ({sum(item['bytes'] for item in records) / 1048576:.1f} MiB), {len(errors)} errors")
    for error in errors:
        print(f"ERROR {error['url']}: {error['error']}")


if __name__ == "__main__":
    main()
