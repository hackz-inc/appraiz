import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/hackathonList/$id/result/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/hackathonList/$id/result/"!</div>;
}
