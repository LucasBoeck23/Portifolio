let transitionVariant = $state('default');

export function getTransitionVariant(): string {
	return transitionVariant;
}

export function setTransitionVariant(variant: string): void {
	transitionVariant = variant;
}
