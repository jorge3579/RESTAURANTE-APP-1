using FluentValidation;
using StockSmartRestaurantQR.Application.DTOs;

namespace StockSmartRestaurantQR.Application.Validation;

public sealed class ProductRequestValidator : AbstractValidator<ProductRequest>
{
    public ProductRequestValidator()
    {
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Cost).GreaterThanOrEqualTo(0);
        RuleFor(x => x.MinStock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Unit).NotEmpty().MaximumLength(30);
    }
}

public sealed class CreateSaleRequestValidator : AbstractValidator<CreateSaleRequest>
{
    public CreateSaleRequestValidator()
    {
        RuleFor(x => x.Items).NotEmpty();
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.ProductId).GreaterThan(0);
            item.RuleFor(x => x.Quantity).GreaterThan(0);
        });
        RuleFor(x => x.ExternalReference).MaximumLength(100);
    }
}

public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}
