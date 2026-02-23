import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { requireAuth } from "@/lib/auth";

export default async function OnboardingPage() {
	const { user, workspace } = await requireAuth();

	if (user.onboardingComplete) {
		redirect("/dashboard");
	}

	return <OnboardingWizard workspaceName={workspace.name} />;
}
