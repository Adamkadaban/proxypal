import { createSignal, onCleanup, Show } from "solid-js";
import { Button } from "./ui";
import { toastStore } from "../stores/toast";

interface CopilotDeviceCodeModalProps {
	userCode: string;
	verificationUri: string;
	expiresAt: number;
	onClose: () => void;
}

export function CopilotDeviceCodeModal(props: CopilotDeviceCodeModalProps) {
	const [copied, setCopied] = createSignal(false);
	const [timeLeft, setTimeLeft] = createSignal(0);

	// Calculate time left
	const updateTimeLeft = () => {
		const now = Math.floor(Date.now() / 1000);
		const remaining = props.expiresAt - now;
		setTimeLeft(Math.max(0, remaining));
	};

	updateTimeLeft();
	const interval = setInterval(updateTimeLeft, 1000);
	onCleanup(() => clearInterval(interval));

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(props.userCode);
			setCopied(true);
			toastStore.success("Code copied!", "Paste it on GitHub");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toastStore.error("Failed to copy", "Please copy manually");
		}
	};

	const handleOpenGitHub = () => {
		window.open(props.verificationUri, "_blank");
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && props.onClose()}
		>
			<div class="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
				{/* Header */}
				<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-blue-600">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
							<img
								src="/logos/copilot.svg"
								alt="GitHub Copilot"
								class="w-6 h-6"
								style={{ filter: "brightness(0) invert(1)" }}
							/>
						</div>
						<div>
							<h2 class="text-lg font-bold text-white">
								Connect GitHub Copilot
							</h2>
							<p class="text-sm text-white/80">Enter code on GitHub</p>
						</div>
					</div>
				</div>

				{/* Content */}
				<div class="p-6 space-y-6">
					{/* User Code Display */}
					<div class="text-center">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
							Enter this code on GitHub:
						</p>
						<div class="relative">
							<div
								class="font-mono text-3xl font-bold tracking-widest text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-xl py-4 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
								onClick={handleCopy}
							>
								{props.userCode}
							</div>
							<button
								onClick={handleCopy}
								class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white dark:bg-gray-600 shadow-md hover:shadow-lg transition-all"
							>
								<Show
									when={copied()}
									fallback={
										<svg
											class="w-5 h-5 text-gray-600 dark:text-gray-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									}
								>
									<svg
										class="w-5 h-5 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</Show>
							</button>
						</div>
					</div>

					{/* Timer */}
					<Show when={timeLeft() > 0}>
						<div class="text-center text-sm text-gray-500 dark:text-gray-400">
							Code expires in{" "}
							<span class="font-mono font-semibold">
								{formatTime(timeLeft())}
							</span>
						</div>
					</Show>

					{/* Action Button */}
					<Button variant="primary" size="lg" class="w-full" onClick={handleOpenGitHub}>
						<svg
							class="w-5 h-5 mr-2"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
						</svg>
						Open GitHub to Authorize
					</Button>

					<p class="text-xs text-center text-gray-500 dark:text-gray-400">
						After authorizing, this dialog will close automatically.
					</p>
				</div>

				{/* Footer */}
				<div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
					<button
						onClick={props.onClose}
						class="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
