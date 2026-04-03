#!/usr/bin/env python3
import requests
import time
import sys
import os

RP_URL = os.environ.get("RP_URL", "http://reportportal-api.staging.svc.cluster.local:8585")
PROJECT = os.environ.get("RP_PROJECT", "playwright_e2e")
API_TOKEN = os.environ.get("RP_API_KEY", "")
LAUNCH_IDS_ENV = os.environ.get("RP_LAUNCH_IDS", "")
LAUNCH_IDS = [int(x.strip()) for x in LAUNCH_IDS_ENV.split(",")] if LAUNCH_IDS_ENV else []
BATCH_SIZE = int(os.environ.get("BATCH_SIZE", "10"))

if not LAUNCH_IDS:
    print("ERROR: No launch IDs provided. You must provide them when running the workflow.")
    sys.exit(1)

if not API_TOKEN:
    print("ERROR: RP_API_KEY environment variable is not set. Please check workflow secrets.")
    sys.exit(1)

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

total_deleted = 0

def fetch_items(launch_id, parent_id=None):
    url = f"{RP_URL}/api/v1/{PROJECT}/item"
    params = {
        "filter.eq.launchId": launch_id,
        "page.size": 50,
        "page.page": 0
    }
    if parent_id:
        params["filter.eq.parentId"] = parent_id
    r = requests.get(url, headers=headers, params=params)
    r.raise_for_status()
    data = r.json()
    return data.get("content", []), data.get("page", {}).get("totalElements", 0)

def delete_items(ids):
    url = f"{RP_URL}/api/v1/{PROJECT}/item"
    params = [("ids", i) for i in ids]
    r = requests.delete(url, headers=headers, params=params)
    return r.status_code, r.text

def delete_launch(launch_id):
    url = f"{RP_URL}/api/v1/{PROJECT}/launch"
    params = [("ids", launch_id)]
    r = requests.delete(url, headers=headers, params=params)
    r.raise_for_status()
    return r.status_code

def delete_tree(launch_id, item_id, item_name, depth=0):
    global total_deleted
    indent = "  " * depth

    while True:
        children, total = fetch_items(launch_id, parent_id=item_id)
        if not children:
            break

        print(f"{indent}→ {item_id} ({item_name}) has {total} children")

        leaves = [c for c in children if not c.get("hasChildren", False)]
        parents = [c for c in children if c.get("hasChildren", False)]

        if leaves:
            leaf_ids = [c["id"] for c in leaves]
            for i in range(0, len(leaf_ids), BATCH_SIZE):
                batch = leaf_ids[i:i + BATCH_SIZE]
                status, text = delete_items(batch)
                if status in (200, 204):
                    total_deleted += len(batch)
                    print(f"{indent}  ✓ Batch deleted {len(batch)} leaves. Total: {total_deleted}")
                else:
                    print(f"{indent}  ERROR {status}: {text[:200]}, falling back to one-by-one")
                    for lid in batch:
                        s, t = delete_items([lid])
                        if s in (200, 204):
                            total_deleted += 1
                        else:
                            print(f"{indent}  FAILED {lid}: {t[:100]}")
                time.sleep(0.2)

        for parent in parents:
            delete_tree(launch_id, parent["id"], parent.get("name", "?"), depth + 1)

    status, text = delete_items([item_id])
    if status in (200, 204):
        total_deleted += 1
        print(f"{indent}✓ [{total_deleted}] Deleted {item_id} ({item_name})")
    else:
        print(f"{indent}ERROR deleting {item_id}: {text[:200]}")
        sys.exit(1)

    time.sleep(0.2)

def process_launch(launch_id):
    global total_deleted
    total_deleted = 0

    print(f"\n{'='*50}")
    print(f"Processing launch: {launch_id}")
    print(f"{'='*50}")

    # Check launch exists
    r = requests.get(
        f"{RP_URL}/api/v1/{PROJECT}/launch/{launch_id}",
        headers=headers
    )
    if r.status_code == 404:
        print(f"Launch {launch_id} not found, skipping.")
        return
    r.raise_for_status()
    launch = r.json()
    print(f"Launch name:   {launch.get('name')}")
    print(f"Launch status: {launch.get('status')}")

    while True:
        print(f"\nFetching top-level items...")
        try:
            items, total = fetch_items(launch_id)
        except requests.HTTPError as e:
            print(f"ERROR: {e}")
            sys.exit(1)

        print(f"Remaining: {total}")
        if not items:
            print("No more items. Moving to launch deletion.")
            break

        for item in items:
            delete_tree(launch_id, item["id"], item.get("name", "?"), depth=0)

    print(f"\nAll items deleted. Total: {total_deleted}")

    try:
        status = delete_launch(launch_id)
        print(f"✓ Launch {launch_id} deleted (HTTP {status}).")
    except requests.HTTPError as e:
        print(f"ERROR deleting launch {launch_id}: {e}")
        print(e.response.text)
        sys.exit(1)

def main():
    print("=================================================")
    print(f"Starting deletion for launches: {LAUNCH_IDS}")
    print(f"Project: {PROJECT}")
    print("=================================================")

    for launch_id in LAUNCH_IDS:
        process_launch(launch_id)

    print("\n=================================================")
    print("✓ All launches processed.")
    print("=================================================")

if __name__ == "__main__":
    main()
