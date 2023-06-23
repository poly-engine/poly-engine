/**
 * Number of cascades to use for directional light shadows.
 * @enum {number}
 * @prop {number} ShadowCascadesMode 
 * @prop {number} None 
 * @prop {number} Linear 
 * @prop {number} Exponential 
*/
export const ShadowCascadesMode = {
	/** No cascades */
	NoCascades: 1,
	/** Two cascades */
	TwoCascades: 2,
	/** Four cascades */
	FourCascades: 4
}