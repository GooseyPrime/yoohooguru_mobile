import React from 'react';
import styled from 'styled-components';

const ComingSoonBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--warning);
  color: var(--gray-900);
  border: 1px solid #ffd700;
  font-weight: var(--font-medium);
  margin-left: 8px;
  vertical-align: middle;
  white-space: nowrap;
`;

/**
 * ComingSoon component to label deferred features
 * @param {boolean} when - Whether to show the badge (default: true)
 * @param {string} text - Custom text for the badge (default: "Coming Soon")
 */
function ComingSoon({ when = true, text = "Coming Soon" }) {
  if (!when) return null;
  
  return (
    <ComingSoonBadge>
      {text}
    </ComingSoonBadge>
  );
}

export default ComingSoon;