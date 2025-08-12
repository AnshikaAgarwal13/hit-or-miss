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
                future_uses = []
                for m in mem:
                    try:
                        future_uses.append(ref[i+1:].index(m))
                    except ValueError:
                        future_uses.append(float('inf'))
                idx = future_uses.index(max(future_uses))
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
