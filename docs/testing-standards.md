# Mybizz CS — Testing Standards

**Authority:** Mandatory — all code must be tested before integration

---

## 1. Testing Levels

### Level 1: Pure Logic Tests (Local)
- Business logic functions with zero Anvil dependencies
- Run locally with pytest — no Anvil connection required
- Fast (milliseconds), zero risk
- Run continuously on every code change

### Level 2: Integration Tests (Uplink)
- Server function integration, Data Tables operations
- Run via Anvil Uplink — accesses real Anvil app
- Slower (seconds), medium risk
- **ALWAYS backup before running**

### Level 3: Manual Verification
- Complete user workflows in browser
- Run by developer after work increment complete

---

## 2. Pure Logic Testing

### Pure Function Characteristics
- No `import anvil` statements
- No Data Tables access
- No server function calls
- No side effects
- Deterministic

### Test Structure
```python
def test_feature_scenario():
    """Test: Clear description"""
    # Arrange
    input_value = ...
    expected_output = ...
    
    # Act
    result = function_under_test(input_value)
    
    # Assert
    assert result == expected_output
```

### Test Naming
`test_[feature]_[scenario]` — descriptive, snake_case, grouped by prefix.

---

## 3. Integration Testing via Uplink

### Safety Protocol
**BEFORE:**
1. All pure logic tests passing
2. Backup created
3. Uplink connection verified

**DURING:**
1. Read before writing
2. Use test data (mark with `source='Test'`)
3. Verify changes after writing

**AFTER:**
1. Clean up test data
2. Verify cleanup successful
3. Create backup if tests pass

### Uplink Connection
```python
import anvil.server, os
anvil.server.connect(os.environ['ANVIL_UPLINK_KEY'])
try:
    result = anvil.server.call('server_function_name')
finally:
    anvil.server.disconnect()
```

---

## 4. Test Execution Workflow

```
1. Write pure logic
2. Write pure logic tests
3. Run tests locally → Pass? Continue. Fail? Fix and retry.
4. Create BACKUP
5. Write integration layer
6. Write integration tests
7. Run integration tests via Uplink → Pass? Backup. Fail? Restore, fix, retry.
8. Document results
```

---

## 5. Common Testing Patterns

### Happy Path
```python
def test_function_valid_input():
    result = function(valid_input)
    assert result == expected_output
```

### Error Handling
```python
def test_function_invalid_input():
    try:
        function(invalid_input)
        assert False, "Expected exception"
    except ExpectedException as e:
        assert "expected message" in str(e).lower()
```

### Boundary Conditions
Test zero, minimum, maximum values explicitly.

---

*End of file*
