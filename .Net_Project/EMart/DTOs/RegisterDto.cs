using System.Text.Json.Serialization;

namespace EMart.DTOs
{
    public class RegisterDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        [JsonPropertyName("isCardHolder")]
        public bool IsCardHolder { get; set; }
    }
}
