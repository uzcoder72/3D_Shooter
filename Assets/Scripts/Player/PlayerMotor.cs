using UnityEngine;

public class PlayerMotor : MonoBehaviour
{
    private CharacterController controller;
    private Vector3 playerVelocity;
    private bool isGrounded;
    public float baseSpeed = 4f;
    public float sprintMultiplier = 1.5f;
    private float speed;
    public float gravity = -9.8f;
    public float jumpHeight = 3f;
    private bool lerpCrouch;
    private float crouchTimer;
    private bool crouching;
    private bool sprinting;
    void Start()
    {
        controller = GetComponent<CharacterController>();
        speed = baseSpeed;
    }
    void Update()
    {
        isGrounded = controller.isGrounded;
        if (lerpCrouch)
        {
            crouchTimer += Time.deltaTime;
            float p = crouchTimer / 1;
            p *= p;
            if (crouching)
                controller.height = Mathf.Lerp(controller.height, 1, p);
            else
                controller.height = Mathf.Lerp(controller.height, 2, p);
            
            if (p > 1)
            {
                lerpCrouch = false;
                crouchTimer = 0f;
            }
        }
    }
    public void SetCrouch(bool state)
    {
        if (crouching == state) return;
        crouching = state;
        crouchTimer = 0f;
        lerpCrouch = true;
    }
    public void SetSprint(bool state)
    {
        sprinting = state;
        speed = sprinting ? baseSpeed * sprintMultiplier : baseSpeed;
    }
    // receive the inputs for our inputManager.cs
    public void ProcessMove(Vector2 input)
    {
        Vector3 moveDirection = Vector3.zero;
        moveDirection.x = input.x;
        moveDirection.z = input.y;
        controller.Move(transform.TransformDirection(moveDirection) * speed * Time.deltaTime);
        playerVelocity.y += gravity * Time.deltaTime;
        if(isGrounded && playerVelocity.y < 0)
            playerVelocity.y = -2f;
        controller.Move(playerVelocity * Time.deltaTime);
        // Debug.Log(playerVelocity.y);
    }
    public void Jump()
    {
        if(isGrounded)
        {
            playerVelocity.y = Mathf.Sqrt(jumpHeight * -3.0f * gravity);
        }
    }
}
