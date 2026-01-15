using UnityEngine;

public class InputManager : MonoBehaviour
{
    private PlayerInput playerInput;
    private PlayerInput.OnFootActions onFoot;
    private PlayerMotor motor;
    private PlayerLook look;
    public bool InteractPressed()
    {
        return onFoot.Interact.triggered;
    }
    void Awake()
    {
        playerInput = new PlayerInput();
        onFoot = playerInput.OnFoot;
        
        motor = GetComponent<PlayerMotor>();
        look = GetComponent<PlayerLook>();
        
        onFoot.Jump.performed += ctx => motor.Jump();

        onFoot.Crouch.started += ctx => motor.SetCrouch(true);
        onFoot.Crouch.canceled += ctx => motor.SetCrouch(false);

        onFoot.Sprint.started += ctx => motor.SetSprint(true);
        onFoot.Sprint.canceled += ctx => motor.SetSprint(false);
    }
    // Update is called once per frame
    void FixedUpdate()
    {
        motor.ProcessMove(onFoot.Movement.ReadValue<Vector2>());
    }
    void LateUpdate()
    {
        look.ProcessLook(onFoot.Look.ReadValue<Vector2>());
    }
    private void OnEnable()
    {
        onFoot.Enable();
    }
    private void OnDisable()
    {
        onFoot.Disable();
    }
    
}
