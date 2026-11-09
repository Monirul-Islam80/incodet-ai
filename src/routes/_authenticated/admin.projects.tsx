import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminTitle, Box, ConfirmButton, Field, inputCls } from "@/components/admin/ui";
import { PillButton } from "@/components/site/Button";
import { Slider } from "@/components/ui/slider";
import { Chip } from "@/components/portal/PortalDashboard";
import {
  milestoneStatusLabels,
  projectStatusLabels,
  type MilestoneStatus,
  type ProjectStatus,
} from "@/lib/portal-types";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  staticData: { sitemap: false },
  component: Projects,
});

const projectStatuses = Object.keys(projectStatusLabels) as ProjectStatus[];
const milestoneStatuses = Object.keys(milestoneStatusLabels) as MilestoneStatus[];

function Projects() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const clients = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () =>
      (
        await supabase
          .from("clients")
          .select("id, name, business_name, email, user_id")
          .order("name")
      ).data ?? [],
  });
  const projects = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, status, progress, client_id, clients(name, business_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const client_id = String(fd.get("client_id") ?? "");
    if (!name || !client_id) return void toast.error("Pick a client and enter a project name.");
    const { data, error } = await supabase
      .from("projects")
      .insert({ name, client_id })
      .select("id")
      .single();
    if (error) return void toast.error("Could not create the project.");
    toast.success("Project created");
    e.currentTarget.reset();
    await qc.invalidateQueries({ queryKey: ["admin-projects"] });
    setSelected(data.id);
  }

  return (
    <>
      <AdminTitle title="Projects" />
      <Box className="mb-6">
        <form onSubmit={create} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Field label="Client">
            <select name="client_id" className={inputCls} defaultValue="">
              <option value="" disabled>
                Choose a client
              </option>
              {clients.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.business_name || c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project name">
            <input name="name" className={inputCls} maxLength={150} />
          </Field>
          <PillButton type="submit" size="sm">
            Add project
          </PillButton>
        </form>
      </Box>
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <ul className="flex flex-col gap-2">
          {projects.data?.length === 0 && <li className="type-body">No projects yet.</li>}
          {projects.data?.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelected(p.id)}
                aria-current={selected === p.id}
                className="w-full rounded-2xl border border-border bg-background p-4 text-left aria-[current=true]:border-ink"
              >
                <p className="font-medium text-ink">{p.name}</p>
                <p className="mt-1 type-small text-muted-foreground">
                  {(p.clients as { business_name: string | null; name: string } | null)
                    ?.business_name || (p.clients as { name: string } | null)?.name}{" "}
                  · {p.progress}%
                </p>
                <div className="mt-2">
                  <Chip status={p.status} label={projectStatusLabels[p.status]} />
                </div>
              </button>
            </li>
          ))}
        </ul>
        {selected ? (
          <ProjectEditor key={selected} id={selected} onDeleted={() => setSelected(null)} />
        ) : (
          <p className="type-body">Choose a project to edit it.</p>
        )}
      </div>
    </>
  );
}

function ProjectEditor({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const qc = useQueryClient();
  const key = ["admin-project", id];
  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, milestones(*), deliverables(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return {
        ...data,
        milestones: [...data.milestones].sort((a, b) => a.sort_order - b.sort_order),
      };
    },
  });
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (q.data) setProgress(q.data.progress);
  }, [q.data]);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
  };
  if (!q.data) return null;
  const p = q.data;

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase
      .from("projects")
      .update({
        name: String(fd.get("name")).trim() || p.name,
        status: fd.get("status") as ProjectStatus,
        progress,
        start_date: (fd.get("start_date") as string) || null,
        target_date: (fd.get("target_date") as string) || null,
        summary: String(fd.get("summary") ?? "").trim() || null,
      })
      .eq("id", id);
    if (error) return void toast.error("Could not save the project.");
    toast.success("Project saved");
    refresh();
  }

  async function addMilestone(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return;
    const { error } = await supabase.from("milestones").insert({
      project_id: id,
      title,
      due_date: (fd.get("due_date") as string) || null,
      sort_order: (p.milestones.at(-1)?.sort_order ?? -1) + 1,
    });
    if (error) return void toast.error("Could not add the milestone.");
    form.reset();
    refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const a = p.milestones[index];
    const b = p.milestones[index + dir];
    if (!a || !b) return;
    await Promise.all([
      supabase.from("milestones").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("milestones").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    refresh();
  }

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    const file = fd.get("file") as File | null;
    const url = String(fd.get("external_url") ?? "").trim();
    if (!title) return void toast.error("Enter a title.");
    let file_path: string | null = null;
    if (file && file.size > 0) {
      file_path = `${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage.from("deliverables").upload(file_path, file);
      if (error) return void toast.error("Upload failed.");
    } else if (!/^https:\/\//.test(url)) {
      return void toast.error("Choose a file or enter an https link.");
    }
    const { error } = await supabase
      .from("deliverables")
      .insert({ project_id: id, title, file_path, external_url: file_path ? null : url });
    if (error) return void toast.error("Could not save the deliverable.");
    toast.success("Deliverable added");
    form.reset();
    refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <Box>
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Field label="Project name" className="md:col-span-2">
            <input name="name" defaultValue={p.name} className={inputCls} />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={p.status} className={inputCls}>
              {projectStatuses.map((s) => (
                <option key={s} value={s}>
                  {projectStatusLabels[s]}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex flex-col gap-3 type-small font-medium text-ink">
            <span id="progress-label">Progress: {progress}%</span>
            <Slider
              aria-labelledby="progress-label"
              value={[progress]}
              min={0}
              max={100}
              step={5}
              onValueChange={(v) => setProgress(v[0] ?? 0)}
            />
          </div>
          <Field label="Start date">
            <input
              type="date"
              name="start_date"
              defaultValue={p.start_date ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Target date">
            <input
              type="date"
              name="target_date"
              defaultValue={p.target_date ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Summary" className="md:col-span-2">
            <textarea name="summary" rows={3} defaultValue={p.summary ?? ""} className={inputCls} />
          </Field>
          <div className="flex items-center gap-4 md:col-span-2">
            <PillButton type="submit" size="sm">
              Save project
            </PillButton>
            <ConfirmButton
              label="Delete project"
              title="Delete this project?"
              description="This also deletes its milestones and deliverables."
              onConfirm={async () => {
                const { error } = await supabase.from("projects").delete().eq("id", id);
                if (error) return void toast.error("Could not delete the project.");
                toast.success("Project deleted");
                qc.invalidateQueries({ queryKey: ["admin-projects"] });
                onDeleted();
              }}
            />
          </div>
        </form>
      </Box>

      <Box>
        <h2 className="type-h3">Milestones</h2>
        <ol className="mt-4 flex flex-col gap-2">
          {p.milestones.map((m, i) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3"
            >
              <span className="min-w-0 flex-1 font-medium text-ink">{m.title}</span>
              <select
                aria-label={`Status for ${m.title}`}
                value={m.status}
                onChange={async (e) => {
                  await supabase
                    .from("milestones")
                    .update({ status: e.target.value as MilestoneStatus })
                    .eq("id", m.id);
                  refresh();
                }}
                className={`${inputCls} w-auto`}
              >
                {milestoneStatuses.map((s) => (
                  <option key={s} value={s}>
                    {milestoneStatusLabels[s]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="rounded-full p-2 hover:bg-bg-soft disabled:opacity-30"
              >
                <ArrowUp aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === p.milestones.length - 1}
                onClick={() => move(i, 1)}
                className="rounded-full p-2 hover:bg-bg-soft disabled:opacity-30"
              >
                <ArrowDown aria-hidden className="size-4" />
              </button>
              <ConfirmButton
                label="Delete"
                title="Delete this milestone?"
                description={m.title}
                onConfirm={async () => {
                  await supabase.from("milestones").delete().eq("id", m.id);
                  refresh();
                }}
              />
            </li>
          ))}
        </ol>
        <form
          onSubmit={addMilestone}
          className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_auto] md:items-end"
        >
          <Field label="New milestone">
            <input name="title" className={inputCls} maxLength={150} />
          </Field>
          <Field label="Due date">
            <input type="date" name="due_date" className={inputCls} />
          </Field>
          <PillButton type="submit" size="sm" variant="secondary">
            Add
          </PillButton>
        </form>
      </Box>

      <Box>
        <h2 className="type-h3">Deliverables</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {p.deliverables.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3"
            >
              <span className="text-ink">
                {d.title}{" "}
                <span className="type-small text-muted-foreground">
                  ({d.file_path ? "file" : "link"})
                </span>
              </span>
              <ConfirmButton
                label="Delete"
                title="Delete this deliverable?"
                description={d.title}
                onConfirm={async () => {
                  if (d.file_path)
                    await supabase.storage.from("deliverables").remove([d.file_path]);
                  await supabase.from("deliverables").delete().eq("id", d.id);
                  refresh();
                }}
              />
            </li>
          ))}
        </ul>
        <form onSubmit={upload} className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input name="title" className={inputCls} maxLength={150} />
          </Field>
          <Field label="File (private)">
            <input name="file" type="file" className={inputCls} />
          </Field>
          <Field label="Or external link (https)" className="md:col-span-2">
            <input name="external_url" type="url" className={inputCls} />
          </Field>
          <PillButton type="submit" size="sm" variant="secondary" className="md:w-fit">
            <Upload aria-hidden className="size-4" /> Add deliverable
          </PillButton>
        </form>
      </Box>
    </div>
  );
}
