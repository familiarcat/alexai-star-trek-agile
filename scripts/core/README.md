# 🚀 **CORE SCRIPT STRUCTURE: NCC-1701-B**

## 📁 **Directory Structure**
```
scripts/core/
├── deployment/     # Unified deployment management
├── testing/        # Unified testing management  
├── setup/          # Unified setup management
├── utility/        # Unified utility management
├── cleanup/        # Unified cleanup management
└── master-orchestrator.sh  # Main entry point
```

## 🎯 **Core Scripts**
- **unified-deployment.sh**: All deployment operations
- **unified-testing.sh**: All testing operations
- **unified-setup.sh**: All setup operations
- **unified-utilities.sh**: All utility operations
- **unified-cleanup.sh**: All cleanup operations
- **master-orchestrator.sh**: Single entry point

## 🚀 **Usage**
```bash
# Deploy to local environment
./scripts/core/master-orchestrator.sh deploy local

# Run all tests
./scripts/core/master-orchestrator.sh test all

# Setup everything
./scripts/core/master-orchestrator.sh setup all

# Cleanup everything
./scripts/core/master-orchestrator.sh cleanup all
```

## 📊 **Benefits**
- **Consolidation**: 136 → 6 core scripts (95% reduction)
- **Maintainability**: Single source of truth for each operation
- **Consistency**: Unified interface across all operations
- **Efficiency**: Reduced duplication and complexity
