# Skill Categorization and Risk Assessment System

## Overview

This document describes the centralized skill categorization and risk assessment system implemented to prevent duplication and ensure consistency across the yoohoo.guru platform.

## Problem Solved

**Issue #28**: Risk categorization logic was duplicated between backend and frontend components, with missing categories ('fitness', 'martial-arts', 'woodworking', 'electrical') leading to inconsistent risk assessments.

## Solution

A shared categorization utility that:
- Centralizes all skill categorization logic
- Provides consistent risk assessment across components
- Includes all previously missing categories
- Prevents future duplication issues

## Architecture

### Backend Utility
**Location**: `backend/src/utils/skillCategorization.js`
- Primary source of truth for categorization logic
- Comprehensive test coverage
- Used by API routes for skill processing

### Frontend Utility  
**Location**: `frontend/src/lib/skillCategorization.js`
- Frontend-compatible version of backend logic
- Includes UI-specific extensions (session templates, display formatting)
- Must be kept in sync with backend utility

### Shared Components
**Location**: `frontend/src/components/LiabilityWaiverModal.js`
- Example implementation using shared categorization
- Demonstrates proper risk assessment usage
- Prevents duplication of risk logic

## Categories and Risk Levels

### Low Risk (No Waiver Required)
- **Creative**: Art, design, music, photography, writing
- **Technical**: Programming, web development, software
- **Language**: Language learning and translation
- **Business**: Marketing, sales, finance, management
- **Academic**: Math, science, tutoring, teaching

### Medium Risk (Moderate Precautions)
- **Health & Fitness**: Yoga, fitness training, wellness activities
- **Practical**: General repair, maintenance, gardening

### High Risk (Liability Waiver Required)
- **Martial Arts**: Combat training, self-defense, boxing
- **Electrical**: Electrical work, wiring, power systems
- **Woodworking**: Furniture making, power tools, carpentry

## Usage Guidelines

### Adding New Categories
1. Update `backend/src/utils/skillCategorization.js`
2. Update `frontend/src/lib/skillCategorization.js`
3. Add corresponding tests
4. Update this documentation

### Risk Assessment
```javascript
// Backend usage
const { categorizeSkill, getSkillRiskLevel, requiresLiabilityWaiver } = require('../utils/skillCategorization');

const category = categorizeSkill('martial arts');  // 'Martial Arts'
const riskLevel = getSkillRiskLevel('martial arts');  // 'high'
const needsWaiver = requiresLiabilityWaiver('martial arts');  // true
```

```javascript
// Frontend usage
import { categorizeSkill, getSkillRiskLevel, requiresLiabilityWaiver } from '../lib/skillCategorization';

const category = categorizeSkill('woodworking');  // 'Woodworking'
const riskLevel = getSkillRiskLevel('woodworking');  // 'high'
const needsWaiver = requiresLiabilityWaiver('woodworking');  // true
```

### Component Integration
```javascript
// Example: Using in a booking component
import { requiresLiabilityWaiver } from '../lib/skillCategorization';
import LiabilityWaiverModal from '../components/LiabilityWaiverModal';

function BookingComponent({ skillName }) {
  const [showWaiver, setShowWaiver] = useState(false);
  
  const handleBooking = () => {
    if (requiresLiabilityWaiver(skillName)) {
      setShowWaiver(true);
    } else {
      proceedWithBooking();
    }
  };
  
  return (
    <>
      <button onClick={handleBooking}>Book Session</button>
      <LiabilityWaiverModal 
        isOpen={showWaiver}
        skillName={skillName}
        onAccept={proceedWithBooking}
        onClose={() => setShowWaiver(false)}
      />
    </>
  );
}
```

## Testing

### Backend Tests
**Location**: `backend/src/utils/skillCategorization.test.js`
- Comprehensive test coverage for all functions
- Tests for missing categories from original issue
- Edge case handling

### Running Tests
```bash
# Backend tests
cd backend && npm test src/utils/skillCategorization.test.js

# All tests  
npm run test
```

## Maintenance

### Keeping Utilities in Sync
1. **Backend First**: Always update backend utility first
2. **Frontend Sync**: Copy changes to frontend utility
3. **Test Both**: Run tests in both environments
4. **Document Changes**: Update this file with any modifications

### Adding New Risk Categories
1. Determine appropriate risk level (LOW, MEDIUM, HIGH, EXTREME)
2. Add to `SKILL_CATEGORIES` in both utilities
3. Include relevant keywords for detection
4. Add session templates for frontend display
5. Write tests for new category
6. Update documentation

## API Integration

The categorization utility is integrated with:
- **Skills API** (`/api/skills`): Categorizes skills in responses
- **User Profiles**: Categorizes user skills for display
- **Session Booking**: Determines waiver requirements
- **Admin Dashboard**: Risk assessment reporting

## Future Considerations

### Potential Enhancements
- **Dynamic Risk Assessment**: AI-powered risk evaluation
- **Regional Variations**: Different risk levels by location
- **User Experience Level**: Risk adjustment based on user skill level
- **Insurance Integration**: Automatic coverage recommendations

### Deprecation Strategy
If this system needs replacement:
1. Create new utility alongside existing
2. Migrate components incrementally  
3. Maintain backward compatibility
4. Remove old utilities only after full migration

## Related Files

- `backend/src/routes/skills.js` - Uses categorization for API responses
- `frontend/src/screens/SkillsPage.js` - Displays categorized skills
- `frontend/src/components/LiabilityWaiverModal.js` - Risk-aware waiver component

## Support

For questions about this system:
1. Check existing tests for usage examples
2. Review this documentation
3. Consult with development team for architectural changes