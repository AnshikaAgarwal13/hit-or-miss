def simulate(ref, frames):
    mem = []
    faults = 0
    hits = 0
    steps = []

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
                replaced = mem.pop(-1)
                mem.append(page)
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
