# Architecture Decision Records (ADR)

## ADR-001: Documentation Storage
**Date**: January 28, 2025  
**Status**: ✅ Accepted  
**Decision**: Store all documentation on GitHub

**Context**: Need centralized, version-controlled documentation
**Outcome**: Using GitHub repository for all docs
**Benefits**: Version control, accessibility, integrated with code

---

## ADR-002: Deployment Platform
**Date**: January 28, 2025  
**Status**: ✅ Accepted  
**Decision**: Use Netlify instead of Vercel

**Context**: Need reliable hosting for Next.js
**Outcome**: Netlify for better reliability
**Trade-offs**: May need to adjust some Next.js features

---

## ADR-003: Database Strategy for Free Tier
**Date**: January 28, 2025  
**Status**: 📝 Proposed  
**Decision**: Use JSONB columns in PostgreSQL

**Context**: Supabase free tier limited to 500MB
**Approach**: Store structured data in JSONB to minimize tables
**Benefits**: Flexibility, fewer migrations, stays under limits

---

## ADR-004: File Storage Strategy
**Date**: January 28, 2025  
**Status**: 📝 Proposed  
**Decision**: Hybrid approach - Supabase + Cloudinary

**Context**: Limited storage on free tiers
**Approach**: 
- Documents → Supabase Storage (1GB free)
- Images → Cloudinary (25GB bandwidth free)
**Benefits**: Optimized usage of both services
