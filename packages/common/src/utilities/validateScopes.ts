'use strict';
import { Scope } from '../types/IUser';

export function ValidateScopes(myScopes: Scope[], requestedScopes: Scope[]): { valid: Scope[]; invalid: Scope[]; } {
	const validScopes = requestedScopes.filter(requestedScope => ScopeIsValid(myScopes, requestedScope));
	const invalidScopes = requestedScopes.filter(requestedScope => !validScopes.includes(requestedScope));

	return { valid: validScopes, invalid: invalidScopes };
}

export function ScopeIsValid(myScopes: string[], requestedScope: string ): boolean {
	const { entity: requestedEntity, right: requestedRight } = GetEntityAndRight(requestedScope);
	return myScopes && myScopes.length > 0 ? 
		myScopes.includes('admin') || 
		myScopes.includes(requestedScope) || 
		ScopeIsValid(myScopes.
			filter(myScope => myScope.startsWith(requestedEntity))?.
			map(myScope => GetEntityAndRight(myScope).right),
				requestedRight) :
		false;
}
function GetEntityAndRight(scope: string) {
	const indexOfFinalDot = scope.lastIndexOf('.')
	const right = indexOfFinalDot && indexOfFinalDot !== -1 ? scope.substring(indexOfFinalDot+1): scope;
	const entity = indexOfFinalDot && indexOfFinalDot !== -1 ? scope.substring(0, indexOfFinalDot) : undefined;

	return { entity, right };
}