# Backend Structure - Improved Organization

**Reorganized**: April 17, 2026

## 📁 New Directory Structure

```
backend/src/
├── config/              Configuration files (Database, JWT, OAuth, Multer)
├── constants/           ✅ NEW - Application constants and messages
│   ├── appConstants.js
│   ├── messages.js
│   └── index.js
├── controllers/         Route handlers and business logic
├── errors/              ✅ NEW - Custom error classes
│   └── index.js
├── helpers/             ✅ NEW - Helper functions (pagination, response formatting)
│   ├── handlers.js      (Response formatting)
│   ├── queryBuilder.js  (Database query builders)
│   └── index.js
├── middleware/          Express middleware
├── models/              Mongoose schemas
├── routes/              API route definitions
├── services/            ✅ NEW - Business services (Email, Captcha)
│   ├── emailService.js
│   ├── captchaService.js
│   └── index.js
├── utils/               Remaining utilities (config helpers, etc.)
├── validations/         ✅ NEW - Input validation schemas
│   ├── validators.js
│   └── index.js
├── seed.js
└── server.js
```

## 🎯 What Changed

### Moved Files
| Old Location | New Location | Purpose |
|---|---|---|
| `utils/helpers.js` | `helpers/` | Pagination, filtering, response formatting |
| `utils/validators.js` | `validations/` | Input validation schemas |
| `utils/emailService.js` | `services/` | Email operations |
| `utils/captchaUtils.js` | `services/captchaService.js` | Captcha operations |

### New Folders Created
1. **`constants/`** - Global app constants, error codes, messages
2. **`errors/`** - Custom error classes for better error handling
3. **`helpers/`** - Utility functions organized by purpose
4. **`services/`** - Business logic services (Email, Captcha, etc.)
5. **`validations/`** - Input validation schemas separate from other utilities

## 📝 File Descriptions

### `constants/`
Central location for application-wide constants:
- **messages.js** - Success/error messages
- **appConstants.js** - Configuration values, enums, defaults

### `errors/`
Custom error classes for consistent error handling:
- `CustomError` - Base error class
- `ValidationError` - Input validation errors (422)
- `AuthenticationError` - Auth failures (401)
- `AuthorizationError` - Permission denied (403)
- `NotFoundError` - Resource not found (404)
- `ConflictError` - Data conflicts (409)
- `DatabaseError` - Database operation failures (500)
- `FileUploadError` - File upload failures (400)

### `helpers/`
Utility functions for common operations:
- **handlers.js** - Response formatting, error responses, pagination
- **queryBuilder.js** - MongoDB query builders (filter, sort)

### `services/`
Business logic and external service integrations:
- **emailService.js** - Nodemailer email operations
- **captchaService.js** - CAPTCHA generation and validation

### `validations/`
Input validation schemas using express-validator:
- **validators.js** - Register, login, password reset, book validators

## ✅ Updated Import Paths

All imports have been automatically updated in:
- ✅ `controllers/bookController.js`
- ✅ `controllers/authController.js`
- ✅ `routes/bookRoutes.js`
- ✅ `routes/authRoutes.js`

**New import pattern:**
```javascript
// Before
import { getPagination } from '../utils/helpers.js';

// After
import { getPagination } from '../helpers/index.js';
```

## 🚀 Benefits

1. **Better Organization** - Files grouped by responsibility
2. **Easier Maintenance** - Clear separation of concerns
3. **Scalability** - Easy to add new services/helpers
4. **Reusability** - Services easily imported across the app
5. **Error Handling** - Centralized custom error classes
6. **Constants Management** - Single source of truth for configs

## 💡 Usage Examples

### Using Services
```javascript
import { sendResetPasswordEmail } from '../services/index.js';

await sendResetPasswordEmail(email, token, name);
```

### Using Helpers
```javascript
import { getPagination, buildFilter, buildSort } from '../helpers/index.js';

const { skip, limit } = getPagination(req.query.page, req.query.limit);
const filter = buildFilter(req.query);
const sort = buildSort(req.query.sortBy, req.query.sortOrder);
```

### Using Validations
```javascript
import { registerValidator, loginValidator } from '../validations/index.js';

router.post('/register', validate(registerValidator), register);
```

### Using Constants
```javascript
import { MESSAGES, ERROR_CODES, ROLES } from '../constants/index.js';

res.status(ERROR_CODES.UNAUTHORIZED).json({
  message: MESSAGES.INVALID_CREDENTIALS
});
```

### Using Custom Errors
```javascript
import { ValidationError, NotFoundError } from '../errors/index.js';

if (!user) {
  throw new NotFoundError('User');
}

throw new ValidationError('Email already exists');
```

## 📊 Structure Benefits

| Before | After |
|--------|-------|
| ❌ 4 utility files scattered | ✅ Organized in meaningful folders |
| ❌ Mixed concerns | ✅ Clear separation |
| ❌ Hard to scale | ✅ Easy to add services |
| ❌ Generic utils | ✅ Specific services |
| ❌ No error classes | ✅ Custom error classes |
| ❌ No constants folder | ✅ Centralized constants |

## 🔗 Related Files

- `server.js` - Main application entry point
- `.env.example` - Environment variables
- `README.md` - Project overview
- `STRUCTURE.md` - Backend structure guide (main)

## ✨ What's Next?

Consider adding:
1. `middleware/errorHandler.js` - Global error handler using custom errors
2. `validators/customRules.js` - Custom validation rules
3. `services/databaseService.js` - Database operation helpers
4. `services/authService.js` - Authentication business logic
5. Tests for all services and helpers

## 📝 Notes

- All existing functionality remains unchanged
- No breaking changes to API
- All imports updated automatically
- Build and tests verified
- Production ready ✅
