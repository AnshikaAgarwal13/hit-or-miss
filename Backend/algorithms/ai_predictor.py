

from collections import Counter

def simulate(ref, frames):
    mem = []
    faults = 0
    hits = 0
    steps = []
    freq = Counter(ref)

    for i, page in enumerate(ref):
        step_info = {
            "step": i + 1,
            "page": page,
            "status": "",
            "memory": [],
            "replaced": None
        }

        if page in mem:
            hits += 1
            step_info["status"] = "HIT"
        else:
            faults += 1
            step_info["status"] = "MISS"
            if len(mem) < frames:
                mem.append(page)
            else:
                # Replace the page with lowest frequency ahead
                future = ref[i+1:]
                score = {m: future.count(m) for m in mem}
                to_replace = min(score, key=score.get)
                idx = mem.index(to_replace)
                replaced = mem[idx]
                mem[idx] = page
                step_info["replaced"] = replaced

        step_info["memory"] = mem.copy()
        steps.append(step_info)

    summary = {
        "hits": hits,
        "faults": faults,
        "hit_ratio": round(hits / len(ref), 2),
        "fault_ratio": round(faults / len(ref), 2),
        "steps": steps
    }

    return summary